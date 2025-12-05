package se.gritacademy.backend.helper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import se.gritacademy.backend.dto.weeklychildstats.CreateWeeklyChildStatsRequestDto;
import se.gritacademy.backend.entity.family.Family;
import se.gritacademy.backend.entity.user.Child;
import se.gritacademy.backend.entity.weeklychildstats.WeeklyChildStats;
import se.gritacademy.backend.mapper.WeeklyChildStatsMapper;
import se.gritacademy.backend.repository.WeeklyChildStatsRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.WeekFields;

@Component
@RequiredArgsConstructor
public class WeeklyChildStatsHelper {

    private final WeeklyChildStatsRepository weeklyChildStatsRepository;

    /**
     * Get current week stats for a child/family, or create if not exists.
     */
    public WeeklyChildStats getOrCreateCurrentWeekStats(Child child, Family family) {
        LocalDate today = LocalDate.now();
        WeekFields weekFields = WeekFields.of(java.util.Locale.getDefault());
        int weekNumber = today.get(weekFields.weekOfWeekBasedYear());
        int year = today.getYear();
        return weeklyChildStatsRepository
                .findByChildIdAndFamilyIdAndWeekNumberAndYear(child.getId(), family.getId(), weekNumber, year)
                .orElseGet(() -> {
                    CreateWeeklyChildStatsRequestDto dto = new CreateWeeklyChildStatsRequestDto();
                    dto.setChildId(child.getId());
                    dto.setFamilyId(family.getId());
                    dto.setWeekNumber(weekNumber);
                    dto.setYear(year);
                    dto.setCompletedChoresCount(0);
                    dto.setEarnedCoins(BigDecimal.ZERO);
                    return weeklyChildStatsRepository.save(WeeklyChildStatsMapper.fromDto(dto, child, family));
                });
    }

    /**
     * Increment completed chores and earned coins for weekly stats.
     */
    public void incrementStats(WeeklyChildStats stats, BigDecimal value) {
        stats.setCompletedChoresCount(stats.getCompletedChoresCount() + 1);
        stats.setEarnedCoins(stats.getEarnedCoins().add(value));
        weeklyChildStatsRepository.save(stats);
    }
}