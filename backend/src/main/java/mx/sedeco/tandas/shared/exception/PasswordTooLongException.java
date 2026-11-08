package mx.sedeco.tandas.shared.exception;

public class PasswordTooLongException extends RuntimeException {

    public PasswordTooLongException() {
        super("La contraseña no puede superar 72 bytes en UTF-8.");
    }
}
