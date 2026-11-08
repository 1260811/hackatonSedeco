package mx.sedeco.tandas.pey.infrastructure;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "pey")
public record PeyProperties(String baseUrl, String apiKey, String webhookSecret) {
    public PeyProperties {
        if (baseUrl == null || baseUrl.isBlank()) baseUrl = "https://api.pey.mx";
    }
}
