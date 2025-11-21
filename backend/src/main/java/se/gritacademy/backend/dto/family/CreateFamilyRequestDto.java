package se.gritacademy.backend.dto.family;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateFamilyRequestDto {
    @NotBlank(message = "Family name is required")
    @Size(max = 50, message = "Family name cannot exceed 50 character")
    private String familyName;
}