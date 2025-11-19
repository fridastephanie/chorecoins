package se.gritacademy.backend.dto.family;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddFamilyMemberRequestDto {
    @NotNull(message = "User ID is required")
    private Long userId;
}