package se.gritacademy.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import se.gritacademy.backend.dto.user.RegisterRequestDto;
import se.gritacademy.backend.entity.user.User;
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
     * Registers a new user (Parent or Child) based on the provided request data.
     * Handles validation, password encoding, entity creation and persistence.
     */
    public User registerUser(RegisterRequestDto request) {
        checkEmailAvailable(request.getEmail());
        String encodedPassword = encodePassword(request.getPassword());
        User user = createUserEntity(request, encodedPassword);
        return saveUser(user);
    }

    /**
     * HELPER: Creates a User entity (Parent or Child) depending on request.userType.
     * Throws 400 BAD REQUEST if the user type is invalid.
     */
    private User createUserEntity(RegisterRequestDto request, String encodedPassword) {
        return switch (request.getRole()) {
            case PARENT -> userMapper.toParent(request, encodedPassword);
            case CHILD -> userMapper.toChild(request, encodedPassword);
            default -> throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid user type"
            );
        };
    }

    /**
     * HELPER: Saves the given user entity to the database.
     */
    private User saveUser(User user) {
        return userRepository.save(user);
    }

    /**
     * HELPER: Checks if the email is already registered.
     * Throws 409 CONFLICT if a user with the same email already exists.
     */
    private void checkEmailAvailable(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }
    }

    /**
     * HELPER: Encodes a raw password using the configured PasswordEncoder.
     */
    private String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }
}