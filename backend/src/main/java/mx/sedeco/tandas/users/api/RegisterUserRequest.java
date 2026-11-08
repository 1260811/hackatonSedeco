package mx.sedeco.tandas.users.api;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterUserRequest(

        @NotBlank
        @Email
        @Size(max = 254)
        String email,

        @NotBlank
        @Size(min = 10)
        String password,

        @NotBlank
        @Size(max = 160)
        String fullName,

        @Size(max = 30)
        String phone

) {}
