package se.gritacademy.backend.dto.chore;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class CreateChoreRequestDto {
    @NotBlank
    private String title;
    private String description;
    private BigDecimal value;
    private LocalDate dueDate;

    @NotNull(message = "familyId is required")
    private Long familyId;

    private Long assignedChildId;
}