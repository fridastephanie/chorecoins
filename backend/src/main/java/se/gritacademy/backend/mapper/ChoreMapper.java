package se.gritacademy.backend.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import se.gritacademy.backend.dto.chore.ChoreDto;
import se.gritacademy.backend.entity.chore.Chore;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ChoreMapper {

    private final UserMapper userMapper;
    private final ChoreSubmissionMapper submissionMapper;

    public ChoreDto toDto(Chore chore) {
        if (chore == null) return null;
        ChoreDto dto = new ChoreDto();
        dto.setId(chore.getId());
        dto.setTitle(chore.getTitle());
        dto.setDescription(chore.getDescription());
        dto.setValue(chore.getValue());
        dto.setStatus(chore.getStatus() != null ? chore.getStatus().name() : null);
        dto.setAssignedTo(chore.getAssignedTo() != null ? userMapper.toUserDto(chore.getAssignedTo()) : null);
        dto.setCreatedByParentId(chore.getCreatedBy() != null ? chore.getCreatedBy().getId() : null);
        dto.setFamilyId(chore.getFamily() != null ? chore.getFamily().getId() : null);
        dto.setDueDate(chore.getDueDate());
        dto.setCreatedAt(chore.getCreatedAt());
        dto.setUpdatedAt(chore.getUpdatedAt());
        if (chore.getSubmissions() == null || chore.getSubmissions().isEmpty()) {
            dto.setSubmissions(Collections.emptySet());
        } else {
            dto.setSubmissions(
                    chore.getSubmissions().stream()
                            .map(submissionMapper::toDto)
                            .collect(Collectors.toSet())
            );
        }
        return dto;
    }
}