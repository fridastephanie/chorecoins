package se.gritacademy.backend.helper;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import se.gritacademy.backend.entity.user.Child;
import se.gritacademy.backend.entity.user.User;
import se.gritacademy.backend.repository.UserRepository;

@Component
@RequiredArgsConstructor
public class UserHelper {

    private final UserRepository userRepository;

    public User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public User getUserOrThrow(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
    }

    public Child ensureChild(User user) {
        if (!(user instanceof Child child)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not a child");
        }
        return (Child) user;
    }
}