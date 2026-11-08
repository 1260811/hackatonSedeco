package mx.sedeco.tandas.pey.infrastructure;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PeyWebhookQueueService {
    private final JdbcTemplate jdbcTemplate;

    public PeyWebhookQueueService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public Optional<WebhookEnvelope> claimNext() {
        jdbcTemplate.update("""
            UPDATE webhook_events
               SET processing_status = CASE WHEN attempt_count >= 10 THEN 'FAILED' ELSE 'RECEIVED' END,
                   processing_started_at = NULL,
                   last_error = 'Processing lease expired; event returned to queue'
             WHERE processing_status = 'PROCESSING'
               AND (processing_started_at IS NULL OR processing_started_at < CURRENT_TIMESTAMP - INTERVAL '2 minutes')
            """);

        List<WebhookEnvelope> rows = jdbcTemplate.query("""
            UPDATE webhook_events
               SET processing_status = 'PROCESSING',
                   processing_started_at = CURRENT_TIMESTAMP,
                   attempt_count = attempt_count + 1,
                   last_error = NULL
             WHERE id = (
                 SELECT id
                   FROM webhook_events
                  WHERE processing_status = 'RECEIVED'
                    AND attempt_count < 10
                  ORDER BY received_at
                  FOR UPDATE SKIP LOCKED
                  LIMIT 1
             )
            RETURNING id, payload::text AS payload, attempt_count
            """, (rs, rowNum) -> new WebhookEnvelope(
                rs.getObject("id", UUID.class),
                rs.getString("payload"),
                rs.getInt("attempt_count")
            ));
        return rows.stream().findFirst();
    }

    @Transactional
    public void markProcessed(UUID id) {
        jdbcTemplate.update("""
            UPDATE webhook_events
               SET processing_status = 'PROCESSED', processed_at = CURRENT_TIMESTAMP, processing_started_at = NULL, last_error = NULL
             WHERE id = ?
            """, id);
    }

    @Transactional
    public void retryOrFail(UUID id, int attempts, String error) {
        String safeError = error == null ? "Unknown processing error" : error.substring(0, Math.min(error.length(), 1000));
        jdbcTemplate.update("""
            UPDATE webhook_events
               SET processing_status = ?, processing_started_at = NULL, last_error = ?
             WHERE id = ?
            """, attempts >= 10 ? "FAILED" : "RECEIVED", safeError, id);
    }

    @Transactional
    public void markIgnored(UUID id, String reason) {
        jdbcTemplate.update("""
            UPDATE webhook_events
               SET processing_status = 'IGNORED', processed_at = CURRENT_TIMESTAMP, processing_started_at = NULL, last_error = ?
             WHERE id = ?
            """, reason, id);
    }

    public record WebhookEnvelope(UUID id, String payload, int attempts) {}
}
