package se.gritacademy.backend.security;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import se.gritacademy.backend.entity.user.Parent;
import se.gritacademy.backend.entity.user.Child;
import se.gritacademy.backend.entity.user.User;

public class SecurityUtils {

    /**
     * Verifies that the user is a Parent, otherwise a 403 is thrown.
     */
    public static Parent requireParent(User user) {
        if (!(user instanceof Parent)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only parents can perform this action");
        }
        return (Parent) user;
    }

    /**
     * Verifies that the user is a Child, otherwise a 403 is thrown.
     */
    public static Child requireChild(User user) {
        if (!(user instanceof Child)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only children can perform this action");
        }
        return (Child) user;
    }
}