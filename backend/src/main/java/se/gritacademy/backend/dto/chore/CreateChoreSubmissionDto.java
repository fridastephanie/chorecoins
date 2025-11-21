package se.gritacademy.backend.dto.chore;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class CreateChoreSubmissionDto {
    @Size(max = 200, message = "Description cannot exceed 200 characters")
    private String commentChild;
    private Set<String> imageUrls;
}
