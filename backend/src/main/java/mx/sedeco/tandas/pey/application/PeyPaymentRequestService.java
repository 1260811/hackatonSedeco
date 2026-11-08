package mx.sedeco.tandas.pey.application;

import mx.sedeco.tandas.pey.infrastructure.PeyApiClient;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Service
public class PeyPaymentRequestService {
    private static final int EXPIRATION_SECONDS = 600;

    private final JdbcTemplate jdbcTemplate;
    private final PeyApiClient peyApiClient;

    public PeyPaymentRequestService(JdbcTemplate jdbcTemplate, PeyApiClient peyApiClient) {
        this.jdbcTemplate = jdbcTemplate;
        this.peyApiClient = peyApiClient;
    }

    @Transactional
    public PaymentRequestResult create(UUID paymentAttemptId) {
        PaymentAttemptContext attempt = jdbcTemplate.queryForObject("""
            SELECT pa.id, pa.payment_request_id, pa.attempt_number, pa.payment_method,
                   pa.pey_reference, pa.qr_payload, pa.expires_at,
                   pr.amount, pr.status AS request_status,
                   pr.receiver_pey_bank_account_id, pr.receiver_clabe_snapshot,
                   ba.pey_bank_account_id, ba.pey_status, ba.clabe,
                   po.period_number, t.name AS tanda_name, u.phone
              FROM payment_attempts pa
              JOIN payment_requests pr ON pr.id = pa.payment_request_id
              JOIN bank_accounts ba ON ba.id = pr.bank_account_id
              JOIN payment_obligations po ON po.id = pr.payment_obligation_id
              JOIN tandas t ON t.id = po.tanda_id
              JOIN users u ON u.id = po.user_id
             WHERE pa.id = ?
             FOR UPDATE OF pa, pr
            """, (rs, rowNum) -> new PaymentAttemptContext(
                rs.getObject("id", UUID.class),
                rs.getObject("payment_request_id", UUID.class),
                rs.getInt("attempt_number"),
                rs.getString("payment_method"),
                rs.getString("pey_reference"),
                rs.getString("qr_payload"),
                rs.getObject("expires_at", OffsetDateTime.class),
                rs.getBigDecimal("amount"),
                rs.getString("request_status"),
                rs.getString("receiver_pey_bank_account_id"),
                rs.getString("receiver_clabe_snapshot"),
                rs.getString("pey_bank_account_id"),
                rs.getString("pey_status"),
                rs.getString("clabe"),
                rs.getInt("period_number"),
                rs.getString("tanda_name"),
                rs.getString("phone")
            ), paymentAttemptId);

        if (attempt.peyReference() != null && !attempt.peyReference().isBlank()) {
            return new PaymentRequestResult(
                attempt.paymentMethod(), attempt.peyReference(), attempt.qrPayload(),
                attempt.expiresAt(), true
            );
        }
        if (!"ACTIVE".equalsIgnoreCase(attempt.peyStatus())) {
            throw new IllegalStateException("The selected bank account is not ACTIVE in Pey");
        }
        if (!Objects.equals(attempt.peyBankAccountId(), attempt.receiverPeyBankAccountId())) {
            throw new IllegalStateException("Bank account snapshot does not match the selected Pey account");
        }
        if (!"PENDING".equals(attempt.requestStatus()) && !"GENERATING".equals(attempt.requestStatus())
            && !"ACTIVE".equals(attempt.requestStatus())) {
            throw new IllegalStateException("Payment request is not available for generation");
        }
        if (attempt.attemptNumber() > 9_999_999) {
            throw new IllegalStateException("Payment attempt number exceeds the CoDi reference limit");
        }

        String concept = ("Tanda " + attempt.tandaName() + " - periodo " + attempt.periodNumber());
        if (concept.length() > 100) concept = concept.substring(0, 100);
        String numRef = Integer.toString(attempt.attemptNumber());
        Map<String, Object> metadata = Map.of(
            "paymentRequestId", attempt.paymentRequestId().toString(),
            "paymentAttemptId", attempt.id().toString()
        );

        String providerReference;
        String payload;
        OffsetDateTime expiresAt = OffsetDateTime.now().plusSeconds(EXPIRATION_SECONDS);

        if ("CODI_QR".equals(attempt.paymentMethod())) {
            var response = peyApiClient.createQr(new PeyApiClient.CreateQrRequest(
                attempt.amount(), concept, EXPIRATION_SECONDS, numRef, false,
                attempt.receiverPeyBankAccountId(), metadata
            ));
            providerReference = response.id();
            payload = response.qrString();
        } else if ("CODI_PUSH".equals(attempt.paymentMethod())) {
            String phone = normalizeMexicanPhone(attempt.phone());
            var response = peyApiClient.createPush(new PeyApiClient.CreatePushRequest(
                attempt.amount(), phone, concept, EXPIRATION_SECONDS, numRef,
                attempt.receiverPeyBankAccountId(), metadata
            ));
            providerReference = response.transactionId();
            payload = response.codiId();
        } else {
            throw new IllegalStateException("Unsupported CoDi payment method: " + attempt.paymentMethod());
        }

        jdbcTemplate.update("""
            UPDATE payment_attempts
               SET pey_reference = ?, qr_payload = ?, status = 'PENDING', expires_at = ?
             WHERE id = ?
            """, providerReference, payload, expiresAt, attempt.id());
        jdbcTemplate.update("""
            UPDATE payment_requests SET status = 'ACTIVE' WHERE id = ?
            """, attempt.paymentRequestId());

        return new PaymentRequestResult(
            attempt.paymentMethod(), providerReference, payload, expiresAt, false
        );
    }

    private String normalizeMexicanPhone(String phone) {
        if (phone == null) throw new IllegalStateException("The payer has no phone number for CoDi Push");
        String digits = phone.replaceAll("\\D", "");
        if (digits.length() == 12 && digits.startsWith("52")) digits = digits.substring(2);
        if (!digits.matches("[0-9]{10}")) {
            throw new IllegalStateException("CoDi Push requires a 10-digit Mexican phone number");
        }
        return digits;
    }

    private record PaymentAttemptContext(
        UUID id, UUID paymentRequestId, int attemptNumber, String paymentMethod,
        String peyReference, String qrPayload, OffsetDateTime expiresAt,
        java.math.BigDecimal amount, String requestStatus,
        String receiverPeyBankAccountId, String receiverClabeSnapshot,
        String peyBankAccountId, String peyStatus, String clabe,
        int periodNumber, String tandaName, String phone
    ) {}

    public record PaymentRequestResult(
        String paymentMethod, String providerReference, String payload,
        OffsetDateTime expiresAt, boolean reusedExistingRequest
    ) {}
}
