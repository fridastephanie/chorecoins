package se.gritacademy.backend.dto.weeklychildstats;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class UpdateWeeklyChildStatsRequestDto {

    @Min(value = 0, message = "Completed chores count cannot be negative")
    private Integer completedChoresCount;

    @Min(value = 0, message = "Earned amount cannot be negative")
    private BigDecimal earnedCoins;

}