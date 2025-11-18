package se.gritacademy.backend.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import se.gritacademy.backend.dto.auth.LoginRequestDto;
import se.gritacademy.backend.dto.auth.LoginResponseDto;
import se.gritacademy.backend.entity.user.User;
import se.gritacademy.backend.service.AuthService;
import se.gritacademy.backend.config.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public LoginResponseDto login(@Valid @RequestBody LoginRequestDto loginRequestDto) {
        User user = authService.login(loginRequestDto.getEmail(), loginRequestDto.getPassword());
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new LoginResponseDto(token, user.getRole());
    }
}