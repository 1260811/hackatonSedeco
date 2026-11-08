package mx.sedeco.tandas.pey.application;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import mx.sedeco.tandas.pey.infrastructure.PeyApiClient;
import mx.sedeco.tandas.pey.infrastructure.PeyWebhookQueueService;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class PeyWebhookProcessor {
    private final PeyWebhookQueueService queue;
    private final PeyApiClient peyApiClient;
    private final PeyPaymentReconciliationService reconciliationService;
    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    public PeyWebhookProcessor(
        PeyWebhookQueueService queue,
        PeyApiClient peyApiClient,
        PeyPaymentReconciliationService reconciliationService,
        JdbcTemplate jdbcTemplate,
        ObjectMapper objectMapper
    ) {
        this.queue = queue;
        this.peyApiClient = peyApiClient;
        this.reconciliationService = reconciliationService;
        this.jdbcTemplate = jdbcTemplate;
        this.objectMapper = objectMapper;
    }

    @Scheduled(fixedDelayString = "${pey.webhook-poll-delay-ms:5000}")
    public void processPendingEvents() {
        for (int i = 0; i < 10; i++) {
            var claimed = queue.claimNext();
            if (claimed.isEmpty()) return;

            var event = claimed.get();
            try {
                JsonNode payload = objectMapper.readTree(event.payload());
                String type = text(payload, "type");

                if ("codi.qr.payment_received".equals(type)
                    || "codi.pn.payment_received".equals(type)) {
                    processPaymentEvent(payload);
                } else if ("bank.account.updated".equals(type)) {
                    processBankAccountEvent(payload);
                } else {
                    queue.markIgnored(event.id(), "Unsupported Pey event type: " + type);
                    continue;
                }

                queue.markProcessed(event.id());
            } catch (Exception ex) {
                queue.retryOrFail(event.id(), event.attempts(), ex.getMessage());
            }
        }
    }

    private void processPaymentEvent(JsonNode webhook) {
        String transactionId = text(webhook, "transactionId");
        if (transactionId == null) throw new IllegalArgumentException("Webhook has no transactionId");

        JsonNode transaction = peyApiClient.getTransaction(transactionId);
        String status = text(transaction, "status");
        if ("PENDING".equals(status)) {
            throw new IllegalStateException("Pey transaction is still PENDING; retry reconciliation");
        }
        reconciliationService.reconcile(webhook, transaction);
    }

    private void processBankAccountEvent(JsonNode webhook) {
        String peyBankAccountId = firstNonBlank(
            text(webhook, "bankAccountId"),
            text(webhook, "id")
        );
        if (peyBankAccountId == null) {
            throw new IllegalArgumentException("Bank account webhook has no account identifier");
        }

        JsonNode account = peyApiClient.getBankAccount(peyBankAccountId);
        String providerStatus = text(account, "codiStatus");
        String internalStatus = switch (providerStatus == null ? "" : providerStatus.toUpperCase()) {
            case "PENDING", "PROCESSING" -> "PENDING";
            case "ACTIVE" -> "ACTIVE";
            case "ERROR" -> "ERROR";
            default -> throw new IllegalStateException("Unknown Pey bank account status: " + providerStatus);
        };

        int updated = jdbcTemplate.update("""
            UPDATE bank_accounts
               SET pey_status = ?, updated_at = CURRENT_TIMESTAMP
             WHERE pey_bank_account_id = ?
            """, internalStatus, peyBankAccountId);

        if (updated == 0) throw new IllegalStateException("Pey bank account is not registered in this platform");
    }

    private String text(JsonNode node, String field) {
        JsonNode value = node == null ? null : node.get(field);
        return value == null || value.isNull() || value.asText().isBlank() ? null : value.asText();
    }

    private String firstNonBlank(String... values) {
        for (String value : values) if (value != null && !value.isBlank()) return value;
        return null;
    }
}
