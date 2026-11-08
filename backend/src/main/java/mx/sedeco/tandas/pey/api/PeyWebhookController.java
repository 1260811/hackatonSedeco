package mx.sedeco.tandas.pey.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import mx.sedeco.tandas.pey.infrastructure.PeyWebhookInboxService;
import mx.sedeco.tandas.pey.infrastructure.PeyWebhookSignatureVerifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/webhooks/pey")
public class PeyWebhookController {
    private final PeyWebhookSignatureVerifier signatureVerifier;
    private final PeyWebhookInboxService inboxService;
    private final ObjectMapper objectMapper;

    public PeyWebhookController(
        PeyWebhookSignatureVerifier signatureVerifier,
        PeyWebhookInboxService inboxService,
        ObjectMapper objectMapper
    ) {
        this.signatureVerifier = signatureVerifier;
        this.inboxService = inboxService;
        this.objectMapper = objectMapper;
    }

    @PostMapping
    public ResponseEntity<WebhookResponse> receive(
        @RequestHeader(value = "webhook-id", required = false) String webhookId,
        @RequestHeader(value = "webhook-timestamp", required = false) String timestamp,
        @RequestHeader(value = "webhook-signature", required = false) String signature,
        @RequestBody String rawBody
    ) {
        if (!signatureVerifier.isValid(webhookId, timestamp, signature, rawBody)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new WebhookResponse("REJECTED", "Invalid webhook signature"));
        }

        final JsonNode event;
        try {
            event = objectMapper.readTree(rawBody);
        } catch (Exception ex) {
            return ResponseEntity.badRequest()
                .body(new WebhookResponse("REJECTED", "Invalid JSON payload"));
        }

        String eventType = textAt(event, "type");
        if (eventType == null) {
            return ResponseEntity.badRequest()
                .body(new WebhookResponse("REJECTED", "Missing event type"));
        }

        String transactionId = firstNonBlank(
            textAt(event, "transactionId"),
            textAt(event.path("data"), "transactionId"),
            textAt(event.path("data").path("transaction"), "id")
        );

        var result = inboxService.receive(webhookId, eventType, transactionId, rawBody);
        return switch (result) {
            case ACCEPTED -> ResponseEntity.accepted()
                .body(new WebhookResponse("RECEIVED", "Webhook stored for reconciliation"));
            case DUPLICATE_DELIVERY -> ResponseEntity.ok()
                .body(new WebhookResponse("DUPLICATE", "Webhook delivery already received"));
            case DUPLICATE_TRANSACTION -> ResponseEntity.ok()
                .body(new WebhookResponse("DUPLICATE", "Transaction already received"));
        };
    }

    private String textAt(JsonNode node, String field) {
        JsonNode value = node == null ? null : node.get(field);
        return value == null || value.isNull() || value.asText().isBlank() ? null : value.asText();
    }

    private String firstNonBlank(String... values) {
        for (String value : values) if (value != null && !value.isBlank()) return value;
        return null;
    }

    public record WebhookResponse(String status, String message) {}
}
