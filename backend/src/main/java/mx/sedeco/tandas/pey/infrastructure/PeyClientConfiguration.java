package mx.sedeco.tandas.pey.infrastructure;

import java.net.http.HttpClient;
import java.time.Duration;

import org.springframework.boot.web.client.ClientHttpRequestFactories;
import org.springframework.boot.web.client.ClientHttpRequestFactorySettings;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;

@Configuration
@EnableConfigurationProperties(PeyProperties.class)
public class PeyClientConfiguration {

    @Bean
    RestClient peyRestClient(RestClient.Builder builder, PeyProperties properties) {
        var requestFactory = ClientHttpRequestFactories.get(
            ClientHttpRequestFactorySettings.DEFAULTS
                .withConnectTimeout(Duration.ofSeconds(5))
                .withReadTimeout(Duration.ofSeconds(15))
        );

        return builder
            .baseUrl(properties.baseUrl())
            .requestFactory(requestFactory)
            .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
            .requestInterceptor((request, body, execution) -> {
                String apiKey = properties.apiKey();
                if (apiKey == null || apiKey.isBlank()) {
                    throw new IllegalStateException("Missing required configuration: PEY_API_KEY");
                }
                request.getHeaders().setBearerAuth(apiKey);
                return execution.execute(request, body);
            })
            .build();
    }
}
