package se.gritacademy.backend.dto.family;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateFamilyRequestDto {
    @NotBlank(message = "Family name is required")
    private String familyName;
}