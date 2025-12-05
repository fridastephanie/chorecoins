package se.gritacademy.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.gritacademy.backend.entity.weeklychildstats.WeeklyChildStats;

import java.util.Optional;
import java.util.List;

public interface WeeklyChildStatsRepository extends JpaRepository<WeeklyChildStats, Long> {

    Optional<WeeklyChildStats> findByChildIdAndFamilyIdAndWeekNumberAndYear(
            Long childId, Long familyId, int weekNumber, int year);

    List<WeeklyChildStats> findByChildId(Long childId);
}