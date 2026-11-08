package mx.sedeco.tandas.pey.api;

import mx.sedeco.tandas.pey.infrastructure.PeyApiClient;
import mx.sedeco.tandas.pey.infrastructure.PeyApiException;
import mx.sedeco.tandas.pey.infrastructure.PeyConnectionException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pey")
public class PeyConnectionController {
    private final PeyApiClient peyApiClient;

    public PeyConnectionController(PeyApiClient peyApiClient) {
        this.peyApiClient = peyApiClient;
    }

    /**
     * Performs a read-only authenticated request to Pey. No payment is created.
     * Protected by the application's normal HTTP Basic authentication.
     */
    @GetMapping("/connection")
    public ResponseEntity<ConnectionResponse> checkConnection() {
        try {
            // A successful response confirms DNS/TLS, API key authentication and API reachability.
            peyApiClient.getApiKeyTransactions(null);
            return ResponseEntity.ok(new ConnectionResponse(
                true, "CONNECTED", "Conexión autenticada con Pey establecida."
            ));
        } catch (PeyApiException ex) {
            if (ex.getStatus().value() == 401 || ex.getStatus().value() == 403) {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(new ConnectionResponse(
                    false, "AUTHENTICATION_FAILED", "Pey rechazó la credencial configurada."
                ));
            }
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(new ConnectionResponse(
                false, "PEY_API_ERROR", "Pey respondió con HTTP " + ex.getStatus().value() + "."
            ));
        } catch (PeyConnectionException ex) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(new ConnectionResponse(
                false, "PEY_UNREACHABLE", "No fue posible establecer comunicación con Pey."
            ));
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(new ConnectionResponse(
                false, "CONFIGURATION_MISSING", "Falta configurar PEY_API_KEY en el entorno del backend."
            ));
        }
    }

    public record ConnectionResponse(boolean connected, String status, String message) {}
}
