package se.gritacademy.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.gritacademy.backend.entity.chore.Chore;
import se.gritacademy.backend.entity.chore.ChoreStatus;
import se.gritacademy.backend.repository.ChoreRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WeeklyApprovedChoreCleanupService {

    private final ChoreRepository choreRepository;

    /**
     * Delete all chores with status APPROVED
     */
    @Transactional
    public int deleteApprovedChores() {
        List<Chore> approvedChores = choreRepository.findByStatus(ChoreStatus.APPROVED);
        int deleted = approvedChores.size();
        choreRepository.deleteAll(approvedChores);
        return deleted;
    }
}
