package se.gritacademy.backend.mapper;

import org.springframework.stereotype.Component;
import se.gritacademy.backend.dto.user.RegisterRequestDto;
import se.gritacademy.backend.entity.user.Parent;

@Component
public class UserMapper {

    public Parent toParent(RegisterRequestDto dto, String encodedPassword) {
        Parent parent = new Parent();
        parent.setFirstName(dto.getFirstName());
        parent.setEmail(dto.getEmail());
        parent.setPasswordHash(encodedPassword);
        parent.setRole("ROLE_PARENT");
        return parent;
    }
}
