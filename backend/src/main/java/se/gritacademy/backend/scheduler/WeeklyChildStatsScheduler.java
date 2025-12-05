package se.gritacademy.backend.scheduler;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import se.gritacademy.backend.dto.weeklychildstats.CreateWeeklyChildStatsRequestDto;
import se.gritacademy.backend.entity.family.Family;
import se.gritacademy.backend.entity.user.Child;
import se.gritacademy.backend.repository.UserRepository;
import se.gritacademy.backend.service.WeeklyChildStatsService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class WeeklyChildStatsScheduler {

    private final WeeklyChildStatsService weeklyChildStatsService;
    private final UserRepository userRepository;

    /**
     * Schedule weekly stats generation every Monday at 00:00
     */
    @Scheduled(cron = "0 0 0 * * MON")
    public void generateWeeklyStats() {
        List<Child> children = fetchAllChildren();
        int currentWeek = getCurrentWeekNumber();
        int currentYear = getCurrentYear();

        for (Child child : children) {
            for (Family family : child.getFamilies()) {
                createStatsIfMissing(child.getId(), family.getId(), currentWeek, currentYear);
            }
        }
    }

    // ----------------- PRIVATE HELPERS -----------------

    /**
     * HELPER: fetch all children with their families
     */
    private List<Child> fetchAllChildren() {
        return userRepository.findAllChildrenWithFamilies();
    }

    /**
     * HELPER: create a weekly stats row if it does not exist
     */
    private void createStatsIfMissing(Long childId, Long familyId, int weekNumber, int year) {
        if (!weeklyChildStatsService.existsByChildAndFamilyAndWeekAndYear(childId, familyId, weekNumber, year)) {
            CreateWeeklyChildStatsRequestDto dto = new CreateWeeklyChildStatsRequestDto();
            dto.setChildId(childId);
            dto.setFamilyId(familyId);
            dto.setWeekNumber(weekNumber);
            dto.setYear(year);
            dto.setCompletedChoresCount(0);
            dto.setEarnedCoins(BigDecimal.ZERO);
            weeklyChildStatsService.createWeeklyStatsSystem(dto);
        }
    }

    /**
     * HELPER: get current week number
     */
    private int getCurrentWeekNumber() {
        LocalDate today = LocalDate.now();
        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        return today.get(weekFields.weekOfWeekBasedYear());
    }

    /**
     * HELPER: get current year
     */
    private int getCurrentYear() {
        return LocalDate.now().getYear();
    }
}
