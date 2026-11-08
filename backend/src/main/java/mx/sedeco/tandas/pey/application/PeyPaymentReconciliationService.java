package mx.sedeco.tandas.pey.application;

import com.fasterxml.jackson.databind.JsonNode;
import mx.sedeco.tandas.pey.infrastructure.PeyApiClient;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class PeyPaymentReconciliationService {
    private final JdbcTemplate jdbcTemplate;

    public PeyPaymentReconciliationService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public ReconciliationResult reconcile(JsonNode webhook, JsonNode transaction) {
        String transactionId = text(webhook, "transactionId");
        if (transactionId == null || !transactionId.equals(text(transaction, "id"))) {
            throw new IllegalArgumentException("Pey transaction id does not match webhook");
        }

        AttemptContext attempt = findAttempt(
            text(transaction, "payableId"),
            transactionId
        );
        if (attempt == null) {
            throw new IllegalStateException("No payment attempt matches the Pey payable reference");
        }

        BigDecimal webhookAmount = decimal(webhook, "amount");
        BigDecimal providerAmount = decimal(transaction, "amount");
        BigDecimal expectedAmount = attempt.expectedAmount();

        String eventBankAccountId = text(webhook, "bankAccountId");
        String providerClabe = text(transaction.path("metadata"), "clabe");

        boolean valid = "PAID".equals(text(transaction, "status"))
            && "CODI".equals(text(transaction, "paymentMethod"))
            && (("CODI_QR".equals(attempt.paymentMethod()) && "API_CODI_QR".equals(text(transaction, "payableType")))
                || ("CODI_PUSH".equals(attempt.paymentMethod()) && "API_CODI_PN".equals(text(transaction, "payableType"))))
            && "MXN".equals(text(transaction, "currency"))
            && expectedAmount.compareTo(providerAmount) == 0
            && expectedAmount.compareTo(webhookAmount) == 0
            && (eventBankAccountId != null
                ? eventBankAccountId.equals(attempt.peyBankAccountId())
                : providerClabe != null && providerClabe.equals(attempt.receiverClabe()))
            && (providerClabe == null || providerClabe.equals(attempt.receiverClabe()));

        if (jdbcTemplate.queryForObject(
            "SELECT EXISTS (SELECT 1 FROM pey_transactions WHERE transaction_id = ?)",
            Boolean.class, transactionId
        )) {
            return ReconciliationResult.DUPLICATE;
        }

        if (!valid) {
            recordDiscrepancy(attempt, transactionId, providerAmount, transaction);
            return ReconciliationResult.DISCREPANCY;
        }

        BigDecimal requestItemsTotal = jdbcTemplate.queryForObject("""
            SELECT COALESCE(SUM(amount), 0)
              FROM payment_request_items
             WHERE payment_request_id = ?
            """, BigDecimal.class, attempt.paymentRequestId());

        if (requestItemsTotal == null || requestItemsTotal.compareTo(expectedAmount) != 0) {
            recordDiscrepancy(attempt, transactionId, providerAmount, transaction);
            return ReconciliationResult.DISCREPANCY;
        }

        UUID paymentId = jdbcTemplate.queryForObject("""
            INSERT INTO payments
                (payment_request_id, payment_type, payment_source, amount, status, confirmed_at)
            VALUES (?, 'COLLECTION', 'PEY', ?, 'CONFIRMED', CURRENT_TIMESTAMP)
            RETURNING id
            """, UUID.class, attempt.paymentRequestId(), providerAmount);

        jdbcTemplate.update("""
            INSERT INTO pey_transactions
                (payment_id, payment_attempt_id, transaction_id, bank_account_id,
                 amount, transaction_status, paid_at)
            VALUES (?, ?, ?, ?, ?, ?, to_timestamp(?))
            """, paymentId, attempt.paymentAttemptId(), transactionId, attempt.bankAccountId(),
            providerAmount, text(transaction, "status"), transaction.path("datePaid").asLong());

        jdbcTemplate.update("""
            INSERT INTO payment_allocations (payment_id, obligation_detail_id, penalty_id, amount)
            SELECT ?, obligation_detail_id, penalty_id, amount
              FROM payment_request_items
             WHERE payment_request_id = ?
            """, paymentId, attempt.paymentRequestId());

        jdbcTemplate.update("""
            UPDATE payment_attempts SET status = 'SUCCEEDED' WHERE id = ?
            """, attempt.paymentAttemptId());
        jdbcTemplate.update("""
            UPDATE payment_requests SET status = 'PAID' WHERE id = ?
            """, attempt.paymentRequestId());

        jdbcTemplate.update("""
            UPDATE obligation_details od
               SET status = CASE
                   WHEN COALESCE((
                       SELECT SUM(pa.amount)
                         FROM payment_allocations pa
                         JOIN payments p ON p.id = pa.payment_id
                        WHERE pa.obligation_detail_id = od.id
                          AND p.status = 'CONFIRMED'
                   ), 0) >= od.amount THEN 'PAID'
                   WHEN COALESCE((
                       SELECT SUM(pa.amount)
                         FROM payment_allocations pa
                         JOIN payments p ON p.id = pa.payment_id
                        WHERE pa.obligation_detail_id = od.id
                          AND p.status = 'CONFIRMED'
                   ), 0) > 0 THEN 'PARTIALLY_PAID'
                   ELSE od.status
               END
             WHERE od.id IN (
                 SELECT obligation_detail_id FROM payment_request_items
                  WHERE payment_request_id = ? AND obligation_detail_id IS NOT NULL
             )
            """, attempt.paymentRequestId());

        jdbcTemplate.update("""
            UPDATE penalties pen
               SET status = CASE
                   WHEN COALESCE((
                       SELECT SUM(pa.amount)
                         FROM payment_allocations pa
                         JOIN payments p ON p.id = pa.payment_id
                        WHERE pa.penalty_id = pen.id AND p.status = 'CONFIRMED'
                   ), 0) >= pen.amount THEN 'PAID'
                   ELSE pen.status
               END
             WHERE pen.id IN (
                 SELECT penalty_id FROM payment_request_items
                  WHERE payment_request_id = ? AND penalty_id IS NOT NULL
             )
            """, attempt.paymentRequestId());

        jdbcTemplate.update("""
            UPDATE payment_obligations po
               SET status = CASE
                   WHEN NOT EXISTS (
                       SELECT 1 FROM obligation_details od
                        WHERE od.payment_obligation_id = po.id
                          AND od.status NOT IN ('PAID', 'CANCELLED')
                   ) THEN 'PAID'
                   WHEN EXISTS (
                       SELECT 1 FROM obligation_details od
                        WHERE od.payment_obligation_id = po.id
                          AND od.status IN ('PAID', 'PARTIALLY_PAID')
                   ) THEN 'PARTIALLY_PAID'
                   ELSE po.status
               END
             WHERE po.id IN (
                 SELECT DISTINCT od.payment_obligation_id
                   FROM payment_request_items pri
                   JOIN obligation_details od ON od.id = pri.obligation_detail_id
                  WHERE pri.payment_request_id = ? AND pri.obligation_detail_id IS NOT NULL
             )
            """, attempt.paymentRequestId());

        jdbcTemplate.update("""
            INSERT INTO audit_logs (tanda_id, action, entity_type, entity_id, new_values)
            VALUES (?, 'PEY_PAYMENT_RECONCILED', 'PAYMENT', ?, jsonb_build_object(
                'transactionId', ?, 'amount', ?, 'source', 'PEY'
            ))
            """, attempt.tandaId(), paymentId, transactionId, providerAmount);

        return ReconciliationResult.CONFIRMED;
    }

    private AttemptContext findAttempt(String payableId, String transactionId) {
        List<AttemptContext> rows = jdbcTemplate.query("""
            SELECT pa.id AS attempt_id, pa.payment_request_id, pa.payment_method, pr.amount,
                   pr.bank_account_id, pr.receiver_pey_bank_account_id,
                   pr.receiver_clabe_snapshot, ba.pey_bank_account_id,
                   po.tanda_id
              FROM payment_attempts pa
              JOIN payment_requests pr ON pr.id = pa.payment_request_id
              JOIN bank_accounts ba ON ba.id = pr.bank_account_id
              JOIN payment_obligations po ON po.id = pr.payment_obligation_id
             WHERE pa.pey_reference = ? OR pa.pey_reference = ?
             FOR UPDATE OF pa, pr
            """, (rs, rowNum) -> new AttemptContext(
                rs.getObject("attempt_id", UUID.class),
                rs.getObject("payment_request_id", UUID.class),
                rs.getBigDecimal("amount"),
                rs.getString("payment_method"),
                rs.getObject("bank_account_id", UUID.class),
                rs.getString("receiver_pey_bank_account_id"),
                rs.getString("receiver_clabe_snapshot"),
                rs.getString("pey_bank_account_id"),
                rs.getObject("tanda_id", UUID.class)
            ), payableId, transactionId);
        if (rows.size() > 1) throw new IllegalStateException("Pey reference maps to multiple payment attempts");
        return rows.isEmpty() ? null : rows.getFirst();
    }

    private void recordDiscrepancy(
        AttemptContext attempt, String transactionId, BigDecimal amount, JsonNode transaction
    ) {
        UUID paymentId = jdbcTemplate.queryForObject("""
            INSERT INTO payments
                (payment_request_id, payment_type, payment_source, amount, status, confirmed_at)
            VALUES (?, 'COLLECTION', 'PEY', ?, 'DISCREPANCY', CURRENT_TIMESTAMP)
            RETURNING id
            """, UUID.class, attempt.paymentRequestId(), amount);

        jdbcTemplate.update("""
            INSERT INTO pey_transactions
                (payment_id, payment_attempt_id, transaction_id, bank_account_id,
                 amount, transaction_status, paid_at)
            VALUES (?, ?, ?, ?, ?, ?, to_timestamp(?))
            """, paymentId, attempt.paymentAttemptId(), transactionId, attempt.bankAccountId(),
            amount, text(transaction, "status"), transaction.path("datePaid").asLong());

        jdbcTemplate.update("""
            INSERT INTO incidents (tanda_id, category, description, related_entity_type, related_entity_id)
            VALUES (?, 'PAYMENT_DISCREPANCY', ?, 'PAYMENT', ?)
            """, attempt.tandaId(), "Pey transaction did not match expected amount, account or CoDi status", paymentId);

        jdbcTemplate.update("""
            INSERT INTO audit_logs (tanda_id, action, entity_type, entity_id, new_values)
            VALUES (?, 'PEY_PAYMENT_DISCREPANCY', 'PAYMENT', ?, jsonb_build_object(
                'transactionId', ?, 'amount', ?, 'status', 'DISCREPANCY'
            ))
            """, attempt.tandaId(), paymentId, transactionId, amount);
    }

    private String text(JsonNode node, String field) {
        JsonNode value = node == null ? null : node.get(field);
        return value == null || value.isNull() || value.asText().isBlank() ? null : value.asText();
    }

    private BigDecimal decimal(JsonNode node, String field) {
        JsonNode value = node == null ? null : node.get(field);
        if (value == null || value.isNull() || !value.isNumber()) {
            throw new IllegalArgumentException("Missing numeric field: " + field);
        }
        return value.decimalValue();
    }

    private record AttemptContext(
        UUID paymentAttemptId, UUID paymentRequestId, BigDecimal expectedAmount,
        String paymentMethod, UUID bankAccountId, String receiverPeyBankAccountId, String receiverClabe,
        String peyBankAccountId, UUID tandaId
    ) {}

    public enum ReconciliationResult { CONFIRMED, DISCREPANCY, DUPLICATE }
}
