package se.gritacademy.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import se.gritacademy.backend.dto.chore.*;
import se.gritacademy.backend.entity.chore.*;
import se.gritacademy.backend.entity.family.Family;
import se.gritacademy.backend.entity.user.Child;
import se.gritacademy.backend.entity.user.Parent;
import se.gritacademy.backend.entity.user.User;
import se.gritacademy.backend.mapper.ChoreMapper;
import se.gritacademy.backend.mapper.ChoreSubmissionMapper;
import se.gritacademy.backend.repository.*;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChoreService {

    private final ChoreRepository choreRepository;
    private final ChoreSubmissionRepository submissionRepository;
    private final FamilyRepository familyRepository;
    private final UserRepository userRepository;
    private final ChoreMapper choreMapper;
    private final ChoreSubmissionMapper submissionMapper;

    public ChoreService(ChoreRepository choreRepository,
                        ChoreSubmissionRepository submissionRepository,
                        FamilyRepository familyRepository,
                        UserRepository userRepository,
                        ChoreMapper choreMapper,
                        ChoreSubmissionMapper submissionMapper) {
        this.choreRepository = choreRepository;
        this.submissionRepository = submissionRepository;
        this.familyRepository = familyRepository;
        this.userRepository = userRepository;
        this.choreMapper = choreMapper;
        this.submissionMapper = submissionMapper;
    }

    /**
     * Creates a new chore for a family, optionally assigning it to a child.
     */
    public ChoreDto createChore(CreateChoreRequestDto request, Parent creator) {
        Family family = getFamilyOrThrow(request.getFamilyId());
        verifyFamilyMember(family, creator);

        Chore chore = createChoreEntity(request, family, creator);
        assignChildIfProvided(chore, request, family);

        return choreMapper.toDto(saveChore(chore));
    }

    /**
     * Retrieves a chore by its ID.
     */
    public ChoreDto getChore(Long choreId) {
        return choreMapper.toDto(getChoreOrThrow(choreId));
    }

    /**
     * Retrieves all chores for a given family.
     */
    public List<ChoreDto> getChoresForFamily(Long familyId) {
        getFamilyOrThrow(familyId); // verify family exists
        return choreRepository.findByFamily_Id(familyId)
                .stream()
                .map(choreMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Assigns a chore to a specific child (parent action).
     */
    public ChoreDto assignChore(Long choreId, Long childId, Parent actor) {
        Chore chore = getChoreOrThrow(choreId);
        User child = getUserOrThrow(childId);

        verifyFamilyMember(chore.getFamily(), actor);
        verifyFamilyMember(chore.getFamily(), child);

        updateChoreAssignment(chore, (Child) child, ChoreStatus.NOT_STARTED);

        return choreMapper.toDto(chore);
    }

    /**
     * Submits a chore by a child, including comments and images.
     */
    public ChoreSubmissionDto submitChore(Long choreId, CreateChoreSubmissionDto request, Child submitter) {
        Chore chore = getChoreOrThrow(choreId);
        verifyAssignedChild(chore, submitter);

        ChoreSubmission submission = createSubmissionEntity(chore, request, submitter);
        ChoreSubmission saved = saveSubmission(submission);

        updateChoreStatus(chore, ChoreStatus.DONE);

        return submissionMapper.toDto(saved);
    }

    /**
     * Approves a child's chore submission and updates the chore and child's balance.
     */
    public ChoreSubmissionDto approveSubmission(Long choreId, Long submissionId, Parent approver, String parentComment) {
        Chore chore = getChoreOrThrow(choreId);
        ChoreSubmission submission = getSubmissionOrThrow(submissionId);
        verifyFamilyMember(chore.getFamily(), approver);
        verifySubmissionBelongsToChore(submission, chore);

        updateSubmissionApproval(submission, true, parentComment);
        updateChoreStatus(chore, ChoreStatus.APPROVED);
        updateChildBalance(chore);

        return submissionMapper.toDto(submission);
    }

    /**
     * Rejects a child's chore submission, providing a reason as a parent comment.
     */
    public ChoreSubmissionDto rejectSubmission(Long choreId, Long submissionId, Parent approver, String reason) {
        Chore chore = getChoreOrThrow(choreId);
        ChoreSubmission submission = getSubmissionOrThrow(submissionId);
        verifyFamilyMember(chore.getFamily(), approver);

        updateSubmissionApproval(submission, false, reason);
        updateChoreStatus(chore, ChoreStatus.NOT_STARTED);

        return submissionMapper.toDto(submission);
    }

    /**
     * Deletes a chore, verifying that the actor is a member of the family.
     */
    public void deleteChore(Long choreId, Parent actor) {
        Chore chore = getChoreOrThrow(choreId);
        verifyFamilyMember(chore.getFamily(), actor);
        choreRepository.delete(chore);
    }

    /**
     * HELPER: Retrieve chore by ID or throw 404
     */
    private Chore getChoreOrThrow(Long choreId) {
        return choreRepository.findById(choreId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Chore not found"));
    }

    /**
     * HELPER: Retrieve family by ID or throw 404
     */
    private Family getFamilyOrThrow(Long familyId) {
        return familyRepository.findById(familyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Family not found"));
    }

    /**
     * HELPER: Verify a user is a member of a family
     */
    private void verifyFamilyMember(Family family, User user) {
        boolean isMember = family.getMembers().stream()
                .anyMatch(member -> member.getId().equals(user.getId()));
        if (!isMember) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User must belong to the family");
    }

    /**
     * HELPER: Retrieve user by ID or throw 404
     */
    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    /**
     * HELPER: Verify child is assigned to chore
     */
    private void verifyAssignedChild(Chore chore, Child child) {
        if (chore.getAssignedTo() == null || !chore.getAssignedTo().getId().equals(child.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This chore is not assigned to you");
        }
    }

    /**
     * HELPER: Verify submission belongs to chore
     */
    private void verifySubmissionBelongsToChore(ChoreSubmission submission, Chore chore) {
        if (!submission.getChore().getId().equals(chore.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Submission does not belong to chore");
        }
    }

    /**
     * HELPER: Create a new Chore entity
     */
    private Chore createChoreEntity(CreateChoreRequestDto request, Family family, Parent creator) {
        Chore chore = new Chore();
        chore.setTitle(request.getTitle());
        chore.setDescription(request.getDescription());
        chore.setValue(request.getValue());
        chore.setDueDate(request.getDueDate());
        chore.setFamily(family);
        chore.setCreatedBy(creator);
        chore.setStatus(ChoreStatus.NOT_STARTED);
        chore.setCreatedAt(Instant.now());
        chore.setUpdatedAt(Instant.now());
        return chore;
    }

    /**
     * HELPER: Create a new ChoreSubmission entity
     * */
    private ChoreSubmission createSubmissionEntity(Chore chore, CreateChoreSubmissionDto request, Child submitter) {
        ChoreSubmission submission = new ChoreSubmission();
        submission.setChore(chore);
        submission.setCommentChild(request.getCommentChild());
        submission.setImageUrls(request.getImageUrls());
        submission.setSubmittedBy(submitter);
        submission.setSubmittedAt(Instant.now());
        submission.setApprovedByParent(false);
        return submission;
    }

    /**
     * HELPER: Save a chore
     */
    private Chore saveChore(Chore chore) {
        return choreRepository.save(chore);
    }

    /**
     * HELPER: Save a submission
     */
    private ChoreSubmission saveSubmission(ChoreSubmission submission) {
        return submissionRepository.save(submission);
    }

    /**
     * HELPER: Assign child to chore if assignedChildId is provided in the request
     */
    private void assignChildIfProvided(Chore chore, CreateChoreRequestDto request, Family family) {
        if (request.getAssignedChildId() != null) {
            User child = getUserOrThrow(request.getAssignedChildId());
            verifyFamilyMember(family, child);
            assignChildToChore(chore, (Child) child);
        }
    }

    /**
     * HELPER: Assign a child to a chore (used in create & assign)
     */
    private void assignChildToChore(Chore chore, Child child) {
        updateChoreAssignment(chore, child, ChoreStatus.NOT_STARTED);
    }

    /**
     * HELPER: Update chore assignment, status, and timestamp
     */
    private void updateChoreAssignment(Chore chore, Child child, ChoreStatus status) {
        chore.setAssignedTo(child);
        chore.setStatus(status);
        chore.setUpdatedAt(Instant.now());
        saveChore(chore);
    }

    /**
     * HELPER: Update submission approval status and parent comment
     */
    private void updateSubmissionApproval(ChoreSubmission submission, boolean approved, String parentComment) {
        submission.setApprovedByParent(approved);
        submission.setCommentParent(parentComment);
        saveSubmission(submission);
    }

    /**
     * HELPER: Update chore status and timestamp
     */
    private void updateChoreStatus(Chore chore, ChoreStatus status) {
        chore.setStatus(status);
        chore.setUpdatedAt(Instant.now());
        saveChore(chore);
    }

    /**
     * HELPER: Update child week balance and completed chore count
     */
    private void updateChildBalance(Chore chore) {
        Child child = chore.getAssignedTo();
        if (child != null && chore.getValue() != null) {
            if (child.getWeekBalance() == null) child.setWeekBalance(chore.getValue());
            else child.setWeekBalance(child.getWeekBalance().add(chore.getValue()));
            child.setWeekCompletedChoresCount(child.getWeekCompletedChoresCount() + 1);
            userRepository.save(child);
        }
    }

    /**
     * HELPER: Retrieve submission by ID or throw 404
     */
    private ChoreSubmission getSubmissionOrThrow(Long submissionId) {
        return submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Submission not found"));
    }
}