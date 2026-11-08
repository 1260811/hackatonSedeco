package mx.sedeco.tandas.users.application;

import mx.sedeco.tandas.shared.exception.EmailAlreadyRegisteredException;
import mx.sedeco.tandas.shared.exception.PasswordTooLongException;
import mx.sedeco.tandas.users.domain.User;
import mx.sedeco.tandas.users.infrastructure.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserRegistrationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private UserRegistrationService service;

    @BeforeEach
    void setUp() {
        service = new UserRegistrationService(userRepository, passwordEncoder);
    }

    @Test
    void registerNormalizesEmailNameAndPhoneAndEncodesPassword() {
        when(userRepository.existsByEmailIgnoreCase("persona@example.com")).thenReturn(false);
        when(passwordEncoder.encode("ClaveSegura2026")).thenReturn("bcrypt-hash");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User result = service.register(
                "  Persona@Example.com  ",
                "ClaveSegura2026",
                "  Persona de Prueba  ",
                "  5512345678  "
        );

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());

        assertEquals("persona@example.com", result.getEmail());
        assertEquals("persona@example.com", captor.getValue().getEmail());
        assertEquals("Persona de Prueba", captor.getValue().getFullName());
        assertEquals("5512345678", captor.getValue().getPhone());
        verify(passwordEncoder).encode("ClaveSegura2026");
    }

    @Test
    void registerConvertsBlankPhoneToNull() {
        when(userRepository.existsByEmailIgnoreCase("persona@example.com")).thenReturn(false);
        when(passwordEncoder.encode("ClaveSegura2026")).thenReturn("bcrypt-hash");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User result = service.register(
                "persona@example.com",
                "ClaveSegura2026",
                "Persona",
                "   "
        );

        assertNull(result.getPhone());
    }

    @Test
    void registerRejectsPasswordLongerThan72Utf8Bytes() {
        String password = "á".repeat(37);

        assertEquals(74, password.getBytes(java.nio.charset.StandardCharsets.UTF_8).length);
        assertThrows(
                PasswordTooLongException.class,
                () -> service.register("persona@example.com", password, "Persona", null)
        );

        verifyNoInteractions(userRepository, passwordEncoder);
    }

    @Test
    void registerRejectsAlreadyRegisteredEmail() {
        when(userRepository.existsByEmailIgnoreCase("persona@example.com")).thenReturn(true);

        assertThrows(
                EmailAlreadyRegisteredException.class,
                () -> service.register(
                        " Persona@Example.com ",
                        "ClaveSegura2026",
                        "Persona",
                        null
                )
        );

        verify(userRepository, never()).save(any(User.class));
        verifyNoInteractions(passwordEncoder);
    }
}
