package se.gritacademy.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import se.gritacademy.backend.dto.user.UserDto;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponseDto {

    private String token;
    private String role;
    private UserDto user;

}