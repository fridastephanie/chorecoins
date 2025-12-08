package se.gritacademy.backend.service.scheduler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.gritacademy.backend.entity.chore.Chore;
import se.gritacademy.backend.entity.chore.ChoreStatus;
import se.gritacademy.backend.repository.ChoreRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpiredChoreCleanupService {

    private final ChoreRepository choreRepository;

    /**
     * Delete all expired chores that are NOT_STARTED
     */
    @Transactional
    public int deleteExpiredChores() {
        LocalDate today = LocalDate.now();
        List<Chore> expiredChores = choreRepository.findByDueDateBefore(today);
        List<Chore> notStartedChores = filterNotStarted(expiredChores);
        int deleted = notStartedChores.size();
        choreRepository.deleteAll(notStartedChores);
        return deleted;
    }

    /**
     * HELPER: Filter a list of chores to only include those NOT_STARTED
     */
    private List<Chore> filterNotStarted(List<Chore> chores) {
        return chores.stream()
                .filter(chore -> chore.getStatus() == ChoreStatus.NOT_STARTED)
                .collect(Collectors.toList());
    }
}