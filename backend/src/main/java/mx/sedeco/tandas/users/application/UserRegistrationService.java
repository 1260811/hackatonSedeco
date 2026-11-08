package mx.sedeco.tandas.users.application;

import mx.sedeco.tandas.shared.exception.EmailAlreadyRegisteredException;
import mx.sedeco.tandas.shared.exception.PasswordTooLongException;
import mx.sedeco.tandas.users.domain.User;
import mx.sedeco.tandas.users.infrastructure.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.Locale;

@Service
public class UserRegistrationService {

    private static final int BCRYPT_MAX_PASSWORD_BYTES = 72;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserRegistrationService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User register(String email, String password, String fullName, String phone) {
        if (password.getBytes(StandardCharsets.UTF_8).length > BCRYPT_MAX_PASSWORD_BYTES) {
            throw new PasswordTooLongException();
        }

        String normalizedEmail = email.strip().toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new EmailAlreadyRegisteredException();
        }

        String normalizedPhone = phone == null || phone.isBlank()
                ? null
                : phone.strip();

        User user = new User(
                normalizedEmail,
                passwordEncoder.encode(password),
                fullName.strip(),
                normalizedPhone
        );

        return userRepository.save(user);
    }
}
