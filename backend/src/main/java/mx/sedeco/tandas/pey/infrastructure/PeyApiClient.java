package mx.sedeco.tandas.pey.infrastructure;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

import java.math.BigDecimal;
import java.util.Map;

@Component
public class PeyApiClient {
    private final RestClient client;

    public PeyApiClient(RestClient peyRestClient) {
        this.client = peyRestClient;
    }

    public BankAccountRegistration registerBankAccount(RegisterBankAccountRequest request) {
        return post("/bank-account", request, BankAccountRegistration.class);
    }

    public JsonNode getBankAccount(String peyBankAccountId) {
        return get("/bank-account/{id}", peyBankAccountId);
    }

    public QrResponse createQr(CreateQrRequest request) {
        return post("/codi/qr", request, QrResponse.class);
    }

    public PushResponse createPush(CreatePushRequest request) {
        return post("/codi/pn", request, PushResponse.class);
    }

    public JsonNode getTransaction(String transactionId) {
        return get("/transaction/{id}", transactionId);
    }

    public JsonNode getQrTransactions(String qrId) {
        return get("/transaction/codi/qr/{id}", qrId);
    }

    public JsonNode getBankAccountTransactions(String bankAccountId) {
        return get("/transaction/bank-account/{id}", bankAccountId);
    }

    public JsonNode getApiKeyTransactions(String nextToken) {
        try {
            return client.get().uri(uriBuilder -> {
                var builder = uriBuilder.path("/transaction/api-key");
                if (nextToken != null && !nextToken.isBlank()) {
                    builder.queryParam("nextToken", nextToken);
                }
                return builder.build();
            }).retrieve().body(JsonNode.class);
        } catch (RestClientResponseException ex) {
            throw new PeyApiException(ex.getStatusCode(), ex.getResponseBodyAsString());
        } catch (RestClientException ex) {
            throw new PeyConnectionException(ex);
        }
    }

    private <T> T post(String path, Object body, Class<T> responseType) {
        try {
            return client.post().uri(path).body(body).retrieve().body(responseType);
        } catch (RestClientResponseException ex) {
            throw new PeyApiException(ex.getStatusCode(), ex.getResponseBodyAsString());
        } catch (RestClientException ex) {
            throw new PeyConnectionException(ex);
        }
    }

    private JsonNode get(String path, String id) {
        try {
            return client.get().uri(path, id).retrieve().body(JsonNode.class);
        } catch (RestClientResponseException ex) {
            throw new PeyApiException(ex.getStatusCode(), ex.getResponseBodyAsString());
        } catch (RestClientException ex) {
            throw new PeyConnectionException(ex);
        }
    }

    public record RegisterBankAccountRequest(String alias, String name, String clabe, String entity) {}
    public record BankAccountRegistration(String id, String codiStatus) {}
    public record CreateQrRequest(
        BigDecimal amount, String concept, Integer expiration, String numRef,
        Boolean generateImage, String bankAccountId, Map<String, Object> metadata
    ) {}
    public record QrResponse(String id, String qrString, String qrImage) {}
    public record CreatePushRequest(
        BigDecimal amount, String phoneNumber, String concept, Integer expiration,
        String numRef, String bankAccountId, Map<String, Object> metadata
    ) {}
    public record PushResponse(String transactionId, String codiId) {}
}
