package se.gritacademy.backend.dto.weeklychildstats;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreateWeeklyChildStatsRequestDto {

    @NotNull(message = "Child ID is required")
    private Long childId;

    @NotNull(message = "Family ID is required")
    private Long familyId;

    @Min(value = 1, message = "Week number must be between 1 and 52")
    @Max(value = 52, message = "Week number must be between 1 and 52")
    private Integer weekNumber;

    @Min(value = 2020, message = "Year must be valid")
    private Integer year;

    private Integer completedChoresCount;

    private BigDecimal earnedCoins = BigDecimal.ZERO;
}