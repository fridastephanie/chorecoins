package se.gritacademy.backend.dto.chore;

import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
public class RejectChoreSubmissionRequestDto {
    @NotBlank(message = "Comment is required")
    private String commentParent;
}
