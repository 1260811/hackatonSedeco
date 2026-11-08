package mx.sedeco.tandas.users.api;

import mx.sedeco.tandas.users.domain.User;
import mx.sedeco.tandas.users.domain.UserStatus;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String phone,
        String fullName,
        UserStatus status,
        Instant createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getPhone(),
                user.getFullName(),
                user.getStatus(),
                user.getCreatedAt()
        );
    }
}
