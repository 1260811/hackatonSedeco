package mx.sedeco.tandas.pey.infrastructure;

import com.standardwebhooks.Webhook;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class PeyWebhookSignatureVerifier {
    private final PeyProperties properties;

    public PeyWebhookSignatureVerifier(PeyProperties properties) {
        this.properties = properties;
    }

    public boolean isValid(String webhookId, String timestamp, String signatureHeader, String rawBody) {
        String secret = properties.webhookSecret();
        if (isBlank(secret) || isBlank(webhookId) || isBlank(timestamp)
            || isBlank(signatureHeader) || rawBody == null) {
            return false;
        }

        try {
            Webhook webhook = new Webhook(secret);
            webhook.verify(rawBody, Map.of(
                "webhook-id", List.of(webhookId),
                "webhook-timestamp", List.of(timestamp),
                "webhook-signature", List.of(signatureHeader)
            ));
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
