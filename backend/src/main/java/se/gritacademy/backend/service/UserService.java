package se.gritacademy.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import se.gritacademy.backend.dto.user.RegisterRequestDto;
import se.gritacademy.backend.entity.user.Parent;
import se.gritacademy.backend.mapper.UserMapper;
import se.gritacademy.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    /**
     * Registers a new parent user.
     * Throws 409 CONFLICT if email is already used.
     */
    public Parent registerParent(RegisterRequestDto request) {
        checkEmailAvailable(request.getEmail());
        String encodedPassword = encodePassword(request.getPassword());
        Parent parent = userMapper.toParent(request, encodedPassword);
        return userRepository.save(parent);
    }

    /**
     * HELPER: Checks if the email is already registered.
     * Throws 409 CONFLICT if the email is taken.
     */
    private void checkEmailAvailable(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }
    }

    /**
     * HELPER: Encodes the raw password using the PasswordEncoder.
     */
    private String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }
}