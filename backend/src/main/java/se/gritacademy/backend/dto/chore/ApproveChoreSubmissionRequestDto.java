package se.gritacademy.backend.dto.chore;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApproveChoreSubmissionRequestDto {
    @NotBlank(message = "Comment is required")
    private String commentParent;
}
