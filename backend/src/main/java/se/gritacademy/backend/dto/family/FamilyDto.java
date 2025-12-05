package se.gritacademy.backend.dto.family;

import lombok.Getter;
import lombok.Setter;
import se.gritacademy.backend.dto.user.UserDto;

import java.util.Set;

@Getter
@Setter
public class FamilyDto {

    private Long id;
    private String familyName;
    private Set<UserDto> members;

}