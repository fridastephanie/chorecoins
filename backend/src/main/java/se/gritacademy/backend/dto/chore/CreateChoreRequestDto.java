package se.gritacademy.backend.dto.chore;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class CreateChoreRequestDto {

    @NotBlank(message = "Title is required")
    @Size(max = 50, message = "Title cannot exceed 50 characters")
    private String title;

    @Size(max = 200, message = "Description cannot exceed 200 characters")
    private String description;

    @NotNull(message = "Value is required")
    @PositiveOrZero(message = "Value must be zero or positive")
    private BigDecimal value;

    @FutureOrPresent(message = "Due date must be today or in the future")
    private LocalDate dueDate;

    @NotNull(message = "familyId is required")
    private Long familyId;

    private Long assignedChildId;

}
