package se.gritacademy.backend.dto.chore;

import lombok.Getter;
import lombok.Setter;
import se.gritacademy.backend.dto.user.UserDto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
public class ChoreDto {
    private Long id;
    private String title;
    private String description;
    private BigDecimal value;
    private String status;
    private UserDto assignedTo;
    private Long createdByParentId;
    private Long familyId;
    private LocalDate dueDate;
    private Instant createdAt;
    private Instant updatedAt;
    private Set<ChoreSubmissionDto> submissions;
}