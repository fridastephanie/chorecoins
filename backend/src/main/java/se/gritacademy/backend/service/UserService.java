package se.gritacademy.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import se.gritacademy.backend.dto.user.RegisterUserRequestDto;
import se.gritacademy.backend.dto.user.UpdateUserRequestDto;
import se.gritacademy.backend.dto.user.UserDto;
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
     */
    public UserDto registerUser(RegisterUserRequestDto request) {
        checkEmailAvailable(request.getEmail());
        String encodedPassword = encodePassword(request.getPassword());
        User user = createUserEntity(request, encodedPassword);
        user = saveUser(user);
        return userMapper.toUserDto(user);
    }

    /**
     * Retrieves a specific user by ID.
     */
    public UserDto getUser(Long userId) {
        User user = getUserOrThrow(userId);
        return userMapper.toUserDto(user);
    }

    /**
     * Updates a user's information (firstName, email, password).
     */
    public UserDto updateUser(Long userId, UpdateUserRequestDto request) {
        User user = getUserOrThrow(userId);
        updateFirstName(user, request.getFirstName());
        updateEmail(user, request.getEmail());
        updatePassword(user, request.getPassword());
        user = saveUser(user);
        return userMapper.toUserDto(user);
    }

    /**
     * Deletes a user by ID and removes them from all associated families.
     */
    public void deleteUser(Long userId) {
        User user = getUserOrThrow(userId);
        removeUserFromFamilies(user);
        userRepository.delete(user);
    }

    /**
     * HELPER: Updates the firstName if provided.
     */
    private void updateFirstName(User user, String firstName) {
        if (firstName != null) {
            user.setFirstName(firstName);
        }
    }

    /**
     * HELPER: Updates the email if provided and checks availability.
     */
    private void updateEmail(User user, String email) {
        if (email != null) {
            checkEmailAvailable(email);
            user.setEmail(email);
        }
    }

    /**
     * HELPER: Updates the password if provided.
     */
    private void updatePassword(User user, String password) {
        if (password != null) {
            user.setPasswordHash(encodePassword(password));
        }
    }

    /**
     * HELPER: Creates a User entity (Parent or Child) depending on request role.
     */
    private User createUserEntity(RegisterUserRequestDto request, String encodedPassword) {
        return switch (request.getRole()) {
            case PARENT -> userMapper.toParent(request, encodedPassword);
            case CHILD -> userMapper.toChild(request, encodedPassword);
            default -> throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid user type"
            );
        };
    }

    /**
     * HELPER: Saves a user entity to the database.
     */
    private User saveUser(User user) {
        return userRepository.save(user);
    }

    /**
     * HELPER: Checks if the email is already registered.
     */
    private void checkEmailAvailable(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }
    }

    /**
     * HELPER: Encodes a raw password.
     */
    private String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    /**
     * HELPER: Retrieves a user by ID or throws 404.
     */
    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    /**
     * HELPER: Removes the given user from all families they belong to.
     */
    private void removeUserFromFamilies(User user) {
        user.getFamilies().forEach(family -> family.getMembers().remove(user));
        user.getFamilies().clear();
    }
}
