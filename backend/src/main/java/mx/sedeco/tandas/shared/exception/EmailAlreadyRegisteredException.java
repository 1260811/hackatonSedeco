package mx.sedeco.tandas.shared.exception;

public class EmailAlreadyRegisteredException extends RuntimeException {
    public EmailAlreadyRegisteredException() {
        super("El correo electrónico ya está registrado.");
    }
}
