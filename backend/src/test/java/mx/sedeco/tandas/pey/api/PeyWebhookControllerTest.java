package mx.sedeco.tandas.pey.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import mx.sedeco.tandas.pey.infrastructure.PeyWebhookInboxService;
import mx.sedeco.tandas.pey.infrastructure.PeyWebhookSignatureVerifier;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class PeyWebhookControllerTest {
    private PeyWebhookSignatureVerifier verifier;
    private PeyWebhookInboxService inbox;
    private PeyWebhookController controller;

    @BeforeEach
    void setUp() {
        verifier = mock(PeyWebhookSignatureVerifier.class);
        inbox = mock(PeyWebhookInboxService.class);
        controller = new PeyWebhookController(verifier, inbox, new ObjectMapper());
    }

    @Test
    void rejectsInvalidSignatureWithoutPersistingEvent() {
        when(verifier.isValid(any(), any(), any(), anyString())).thenReturn(false);

        var response = controller.receive("msg_1", "123", "v1,bad", "{\"type\":\"codi.qr.payment_received\"}");

        assertEquals(401, response.getStatusCode().value());
        verifyNoInteractions(inbox);
    }

    @Test
    void storesSignedPaymentEventAndReturnsAccepted() {
        when(verifier.isValid(eq("msg_1"), eq("123"), eq("v1,valid"), anyString())).thenReturn(true);
        when(inbox.receive(eq("msg_1"), eq("codi.qr.payment_received"), eq("tx_1"), anyString()))
            .thenReturn(PeyWebhookInboxService.ReceiptResult.ACCEPTED);

        var response = controller.receive(
            "msg_1", "123", "v1,valid",
            "{\"type\":\"codi.qr.payment_received\",\"data\":{\"transactionId\":\"tx_1\"}}"
        );

        assertEquals(202, response.getStatusCode().value());
        assertEquals("RECEIVED", response.getBody().status());
        verify(inbox).receive(eq("msg_1"), eq("codi.qr.payment_received"), eq("tx_1"), anyString());
    }

    @Test
    void acknowledgesDuplicateDelivery() {
        when(verifier.isValid(any(), any(), any(), anyString())).thenReturn(true);
        when(inbox.receive(anyString(), anyString(), nullable(String.class), anyString()))
            .thenReturn(PeyWebhookInboxService.ReceiptResult.DUPLICATE_DELIVERY);

        var response = controller.receive("msg_1", "123", "v1,valid", "{\"type\":\"bank.account.updated\"}");

        assertEquals(200, response.getStatusCode().value());
        assertEquals("DUPLICATE", response.getBody().status());
    }
}
