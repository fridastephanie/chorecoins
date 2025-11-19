package se.gritacademy.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import se.gritacademy.backend.config.JwtUtil;
import se.gritacademy.backend.dto.auth.LoginResponseDto;
import se.gritacademy.backend.dto.user.UserRole;
import se.gritacademy.backend.entity.user.User;
import se.gritacademy.backend.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Logs in a user by email and password.
     * Throws 401 UNAUTHORIZED if credentials are invalid.
     */
    public LoginResponseDto login(String email, String rawPassword) {
        User user = getUserOrThrow(email);
        verifyPassword(rawPassword, user.getPasswordHash());

        UserRole userRole = UserRole.valueOf(user.getRole().replace("ROLE_", ""));
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new LoginResponseDto(token, userRole.name());
    }

    /**
     * HELPER: Fetches a user by email or throws 401 UNAUTHORIZED if not found.
     */
    private User getUserOrThrow(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
    }

    /**
     * HELPER: Verifies that the raw password matches the hashed password.
     * Throws 401 UNAUTHORIZED if it does not match.
     */
    private void verifyPassword(String rawPassword, String hashedPassword) {
        if (!passwordEncoder.matches(rawPassword, hashedPassword)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
    }
}