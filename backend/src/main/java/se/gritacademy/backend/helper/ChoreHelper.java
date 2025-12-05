package se.gritacademy.backend.helper;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import se.gritacademy.backend.entity.chore.Chore;
import se.gritacademy.backend.entity.chore.ChoreStatus;
import se.gritacademy.backend.entity.chore.ChoreSubmission;
import se.gritacademy.backend.entity.user.Child;
import se.gritacademy.backend.repository.ChoreRepository;
import se.gritacademy.backend.repository.ChoreSubmissionRepository;

@Component
@RequiredArgsConstructor
public class ChoreHelper {

    private final ChoreRepository choreRepository;
    private final ChoreSubmissionRepository submissionRepository;

    /**
     * Get a chore by ID or throw 404 if not found.
     */
    public Chore getChoreOrThrow(Long choreId) {
        return choreRepository.findById(choreId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Chore not found"));
    }

    /**
     * Get a submission by ID or throw 404 if not found.
     */
    public ChoreSubmission getSubmissionOrThrow(Long submissionId) {
        return submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Submission not found"));
    }

    /**
     * Verify a chore is assigned to the provided child.
     */
    public void verifyAssignedChild(Chore chore, Child child) {
        if (chore.getAssignedTo() == null || !chore.getAssignedTo().getId().equals(child.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This chore is not assigned to you");
        }
    }

    /**
     * Verify a submission belongs to a chore, else throw 400.
     */
    public void verifySubmissionBelongsToChore(ChoreSubmission submission, Chore chore) {
        if (!submission.getChore().getId().equals(chore.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Submission does not belong to chore");
        }
    }

    /**
     * Ensure the chore is not already approved.
     * Throws 400 Bad Request if chore is already approved.
     */
    public void ensureChoreNotAlreadyApproved(Chore chore) {
        if (chore.getStatus() == ChoreStatus.APPROVED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chore is already approved");
        }
    }
}
