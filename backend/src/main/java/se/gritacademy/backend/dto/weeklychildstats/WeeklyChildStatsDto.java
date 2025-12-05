package se.gritacademy.backend.dto.weeklychildstats;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class WeeklyChildStatsDto {

    private Long id;
    private Long childId;
    private Long familyId;
    private Integer weekNumber;
    private Integer year;
    private Integer completedChoresCount;
    private BigDecimal earnedCoins;

}