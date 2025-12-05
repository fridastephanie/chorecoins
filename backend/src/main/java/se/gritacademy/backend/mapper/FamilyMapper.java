package se.gritacademy.backend.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import se.gritacademy.backend.dto.family.FamilyDto;
import se.gritacademy.backend.entity.family.Family;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class FamilyMapper {

    private final UserMapper userMapper;

    public FamilyDto toFamilyDto(Family family) {
        FamilyDto dto = new FamilyDto();
        dto.setId(family.getId());
        dto.setFamilyName(family.getFamilyName());
        dto.setMembers(family.getMembers().stream()
                .map(userMapper::toUserDto)
                .collect(Collectors.toSet()));
        return dto;
    }
}