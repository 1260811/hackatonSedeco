package mx.sedeco.tandas.pey.infrastructure;

public class PeyConnectionException extends RuntimeException {
    public PeyConnectionException(Throwable cause) {
        super("Unable to communicate with Pey API", cause);
    }
}
