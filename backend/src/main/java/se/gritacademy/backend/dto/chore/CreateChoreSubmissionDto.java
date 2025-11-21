package se.gritacademy.backend.dto.chore;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class CreateChoreSubmissionDto {
    @NotBlank(message = "Comment is required")
    private String commentChild;
    private Set<String> imageUrls;
}
