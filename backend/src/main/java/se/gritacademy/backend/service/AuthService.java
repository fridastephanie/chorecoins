package se.gritacademy.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import se.gritacademy.backend.entity.user.User;
import se.gritacademy.backend.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Logs in a user by email and password.
     * Throws 401 UNAUTHORIZED if credentials are invalid.
     */
    public User login(String email, String rawPassword) {
        User user = getUserOrThrow(email);
        verifyPassword(rawPassword, user.getPasswordHash());
        return user;
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