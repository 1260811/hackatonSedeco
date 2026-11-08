package mx.sedeco.tandas.pey.infrastructure;

import org.springframework.http.HttpStatusCode;

public class PeyApiException extends RuntimeException {
    private final HttpStatusCode status;
    private final String providerResponse;

    public PeyApiException(HttpStatusCode status, String providerResponse) {
        super("Pey API request failed with HTTP " + status.value());
        this.status = status;
        this.providerResponse = providerResponse;
    }

    public HttpStatusCode getStatus() {
        return status;
    }

    public String getProviderResponse() {
        return providerResponse;
    }
}
