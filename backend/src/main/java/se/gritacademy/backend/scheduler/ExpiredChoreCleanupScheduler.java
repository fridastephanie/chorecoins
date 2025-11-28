package se.gritacademy.backend.scheduler;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import se.gritacademy.backend.service.ExpiredChoreCleanupService;

@Service
@RequiredArgsConstructor
public class ExpiredChoreCleanupScheduler {

    private final ExpiredChoreCleanupService expiredChoreCleanupService;

    /**
     * Run every night at 00:01
     */
    @Scheduled(cron = "0 1 0 * * *")
    public void cleanupExpiredChores() {
        int deleted = expiredChoreCleanupService.deleteExpiredChores();
    }
}