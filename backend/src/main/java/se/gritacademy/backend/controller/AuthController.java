package se.gritacademy.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import se.gritacademy.backend.dto.auth.LoginRequestDto;
import se.gritacademy.backend.dto.auth.LoginResponseDto;
import se.gritacademy.backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public LoginResponseDto login(@Valid @RequestBody LoginRequestDto loginRequestDto) {
        return authService.login(loginRequestDto.getEmail(), loginRequestDto.getPassword());
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.OK)
    public void logout(@RequestHeader("Authorization") String authHeader) {
        authService.logout(authHeader);
    }
}