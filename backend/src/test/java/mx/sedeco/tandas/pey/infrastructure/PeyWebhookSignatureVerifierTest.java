package mx.sedeco.tandas.pey.infrastructure;

import org.junit.jupiter.api.Test;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.*;

class PeyWebhookSignatureVerifierTest {

    @Test
    void acceptsValidStandardWebhookSignature() throws Exception {
        byte[] key = "test-webhook-secret".getBytes(StandardCharsets.UTF_8);
        String secret = "whsec_" + Base64.getEncoder().encodeToString(key);
        String id = "msg_123";
        String timestamp = String.valueOf(Instant.now().getEpochSecond());
        String body = "{\"type\":\"codi.qr.payment_received\"}";
        String signed = id + "." + timestamp + "." + body;

        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(key, "HmacSHA256"));
        String signature = "v1," + Base64.getEncoder().encodeToString(
            mac.doFinal(signed.getBytes(StandardCharsets.UTF_8))
        );

        var verifier = new PeyWebhookSignatureVerifier(new PeyProperties(
            "https://api.pey.mx", "api-key", secret
        ));

        assertTrue(verifier.isValid(id, timestamp, signature, body));
    }

    @Test
    void rejectsInvalidSignature() {
        var verifier = new PeyWebhookSignatureVerifier(new PeyProperties(
            "https://api.pey.mx", "api-key",
            "whsec_dGVzdC13ZWJob29rLXNlY3JldA=="
        ));

        assertFalse(verifier.isValid("msg_123",
            String.valueOf(Instant.now().getEpochSecond()), "v1,bad-signature", "{}"));
    }

    @Test
    void rejectsExpiredTimestamp() {
        var verifier = new PeyWebhookSignatureVerifier(new PeyProperties(
            "https://api.pey.mx", "api-key",
            "whsec_dGVzdC13ZWJob29rLXNlY3JldA=="
        ));

        assertFalse(verifier.isValid("msg_123", "1", "v1,anything", "{}"));
    }
}
