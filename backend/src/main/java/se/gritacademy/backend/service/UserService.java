package se.gritacademy.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import se.gritacademy.backend.dto.family.FamilyDto;
import se.gritacademy.backend.dto.user.RegisterUserRequestDto;
import se.gritacademy.backend.dto.user.UpdateUserRequestDto;
import se.gritacademy.backend.dto.user.UserDto;
import se.gritacademy.backend.entity.user.User;
import se.gritacademy.backend.mapper.FamilyMapper;
import se.gritacademy.backend.mapper.UserMapper;
import se.gritacademy.backend.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final FamilyMapper familyMapper;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       UserMapper userMapper, FamilyMapper familyMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
        this.familyMapper = familyMapper;
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
     * Only allowed if the actor is the same user.
     */
    public UserDto updateUser(Long userId, UpdateUserRequestDto request, User actor) {
        User targetUser = getUserOrThrow(userId);
        checkModifyPermission(actor, targetUser);
        updateFirstName(targetUser, request.getFirstName());
        updateEmail(targetUser, request.getEmail());
        updatePassword(targetUser, request.getPassword());
        targetUser = userRepository.save(targetUser);
        return userMapper.toUserDto(targetUser);
    }

    /**
     * Deletes a user by ID and removes them from all associated families.
     * Only allowed if the actor is the same user.
     */
    public void deleteUser(Long userId, User actor) {
        User user = getUserOrThrow(userId);
        checkModifyPermission(actor, user);
        removeUserFromFamilies(user);
        userRepository.delete(user);
    }

    /**
     * Retrieves all families a user belongs to.
     */
    public List<FamilyDto> getUserFamilies(Long userId, User actor) {
        User user = getUserOrThrow(userId);
        checkViewPermission(actor, user);
        return mapFamiliesToDto(user);
    }

    /**
     * HELPER: Ensures the actor can modify the target — only allowed for self.
     */
    private void checkModifyPermission(User actor, User targetUser) {
        if (!actor.getId().equals(targetUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only modify your own account");
        }
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
     * HELPER: Updates the email if provided and checks that it is not already used.
     */
    private void updateEmail(User user, String email) {
        if (email != null) {
            checkEmailAvailable(email);
            user.setEmail(email);
        }
    }

    /**
     * HELPER: Updates and encodes the password if provided.
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
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    /**
     * HELPER: Removes the given user from all families they belong to.
     */
    private void removeUserFromFamilies(User user) {
        user.getFamilies().forEach(family -> family.getMembers().remove(user));
        user.getFamilies().clear();
    }

    /**
     * HELPER: Check that actor can see user's families.
     */
    private void checkViewPermission(User actor, User targetUser) {
        if (!actor.getId().equals(targetUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only view your own families");
        }
    }

    /**
     * HELPER: Maps all families to FamilyDto
     */
    private List<FamilyDto> mapFamiliesToDto(User user) {
        return user.getFamilies().stream()
                .map(familyMapper::toFamilyDto)
                .collect(Collectors.toList());
    }
}