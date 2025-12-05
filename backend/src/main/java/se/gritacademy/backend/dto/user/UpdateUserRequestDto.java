package se.gritacademy.backend.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequestDto {

    @Size(max = 50, message = "Firstname cannot exceed 50 character")
    private String firstName;

    @Email(message = "Email must be valid")
    private String email;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

}
