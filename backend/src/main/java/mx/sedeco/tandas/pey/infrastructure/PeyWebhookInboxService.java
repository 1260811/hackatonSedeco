package mx.sedeco.tandas.pey.infrastructure;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PeyWebhookInboxService {
    private final JdbcTemplate jdbcTemplate;

    public PeyWebhookInboxService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public ReceiptResult receive(String webhookId, String eventType, String transactionId, String payload) {
        int inserted = jdbcTemplate.update("""
            INSERT INTO webhook_events
                (webhook_id, event_type, transaction_id, payload, signature_valid, processing_status)
            VALUES (?, ?, ?, CAST(? AS jsonb), TRUE, 'RECEIVED')
            ON CONFLICT DO NOTHING
            """, webhookId, eventType, transactionId, payload);

        if (inserted == 1) return ReceiptResult.ACCEPTED;

        boolean sameDelivery = Boolean.TRUE.equals(jdbcTemplate.queryForObject(
            "SELECT EXISTS (SELECT 1 FROM webhook_events WHERE webhook_id = ?)",
            Boolean.class, webhookId
        ));
        if (sameDelivery) return ReceiptResult.DUPLICATE_DELIVERY;

        if (transactionId != null) {
            boolean sameTransaction = Boolean.TRUE.equals(jdbcTemplate.queryForObject(
                "SELECT EXISTS (SELECT 1 FROM webhook_events WHERE transaction_id = ?)",
                Boolean.class, transactionId
            ));
            if (sameTransaction) return ReceiptResult.DUPLICATE_TRANSACTION;
        }

        throw new IllegalStateException("Webhook insert was rejected by an unexpected database constraint");
    }

    public enum ReceiptResult {
        ACCEPTED, DUPLICATE_DELIVERY, DUPLICATE_TRANSACTION
    }
}
