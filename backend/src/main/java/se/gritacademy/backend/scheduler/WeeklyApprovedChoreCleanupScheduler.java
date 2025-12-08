package se.gritacademy.backend.scheduler;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import se.gritacademy.backend.service.scheduler.WeeklyApprovedChoreCleanupService;

@Service
@RequiredArgsConstructor
public class WeeklyApprovedChoreCleanupScheduler {

    private final WeeklyApprovedChoreCleanupService weeklyApprovedChoreCleanupService;

    /**
     * Run every Monday at 00:00
     */
    @Scheduled(cron = "0 0 0 * * MON")
    public void cleanupApprovedChores() {
        int deleted = weeklyApprovedChoreCleanupService.deleteApprovedChores();
        System.out.println("Deleted " + deleted + " approved chores.");
    }
}
