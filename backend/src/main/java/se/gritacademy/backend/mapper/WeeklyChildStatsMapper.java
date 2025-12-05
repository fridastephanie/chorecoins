package se.gritacademy.backend.mapper;

import org.springframework.stereotype.Component;
import se.gritacademy.backend.dto.weeklychildstats.CreateWeeklyChildStatsRequestDto;
import se.gritacademy.backend.dto.weeklychildstats.WeeklyChildStatsDto;
import se.gritacademy.backend.entity.family.Family;
import se.gritacademy.backend.entity.user.Child;
import se.gritacademy.backend.entity.weeklychildstats.WeeklyChildStats;

import java.math.BigDecimal;

@Component
public class WeeklyChildStatsMapper {

    public WeeklyChildStatsDto toDto(WeeklyChildStats stats) {
        WeeklyChildStatsDto dto = new WeeklyChildStatsDto();
        dto.setId(stats.getId());
        dto.setChildId(stats.getChild().getId());
        dto.setFamilyId(stats.getFamily().getId());
        dto.setWeekNumber(stats.getWeekNumber());
        dto.setYear(stats.getYear());
        dto.setCompletedChoresCount(stats.getCompletedChoresCount());
        dto.setEarnedCoins(stats.getEarnedCoins());
        return dto;
    }

    public static WeeklyChildStats fromDto(CreateWeeklyChildStatsRequestDto dto, Child child, Family family) {
        WeeklyChildStats stats = new WeeklyChildStats();
        stats.setChild(child);
        stats.setFamily(family);
        stats.setWeekNumber(dto.getWeekNumber());
        stats.setYear(dto.getYear());
        stats.setCompletedChoresCount(dto.getCompletedChoresCount() != null ? dto.getCompletedChoresCount() : 0);
        stats.setEarnedCoins(dto.getEarnedCoins() != null ? dto.getEarnedCoins() : BigDecimal.ZERO);
        return stats;
    }
}
