package se.gritacademy.backend.dto.chore;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApproveChoreSubmissionRequestDto {

    @Size(max = 200, message = "Description cannot exceed 200 characters")
    private String commentParent;

}
