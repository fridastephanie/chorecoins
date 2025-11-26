package se.gritacademy.backend.mapper;

import org.springframework.stereotype.Component;
import se.gritacademy.backend.dto.user.RegisterUserRequestDto;
import se.gritacademy.backend.dto.user.UserDto;
import se.gritacademy.backend.dto.user.UserRole;
import se.gritacademy.backend.entity.user.Child;
import se.gritacademy.backend.entity.user.Parent;
import se.gritacademy.backend.entity.user.User;

@Component
public class UserMapper {

    public UserDto toUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setEmail(user.getEmail());
        dto.setRole(UserRole.valueOf(user.getRole().replace("ROLE_", "")));
        return dto;
    }

    public Parent toParent(RegisterUserRequestDto dto, String encodedPassword) {
        Parent parent = new Parent();
        parent.setFirstName(dto.getFirstName());
        parent.setEmail(dto.getEmail());
        parent.setPasswordHash(encodedPassword);
        parent.setRole("ROLE_PARENT");
        return parent;
    }

    public Child toChild(RegisterUserRequestDto dto, String encodedPassword) {
        Child child = new Child();
        child.setFirstName(dto.getFirstName());
        child.setEmail(dto.getEmail());
        child.setPasswordHash(encodedPassword);
        child.setRole("ROLE_CHILD");
        return child;
    }
}
