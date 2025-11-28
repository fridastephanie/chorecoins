package se.gritacademy.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import se.gritacademy.backend.dto.chore.*;
import se.gritacademy.backend.dto.weeklychildstats.CreateWeeklyChildStatsRequestDto;
import se.gritacademy.backend.entity.chore.*;
import se.gritacademy.backend.entity.family.Family;
import se.gritacademy.backend.entity.user.Child;
import se.gritacademy.backend.entity.user.Parent;
import se.gritacademy.backend.entity.user.User;
import se.gritacademy.backend.entity.weeklychildstats.WeeklyChildStats;
import se.gritacademy.backend.mapper.ChoreMapper;
import se.gritacademy.backend.mapper.ChoreSubmissionMapper;
import se.gritacademy.backend.mapper.WeeklyChildStatsMapper;
import se.gritacademy.backend.repository.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.List;

@Service
public class ChoreService {

    private final ChoreRepository choreRepository;
    private final ChoreSubmissionRepository submissionRepository;
    private final FamilyRepository familyRepository;
    private final UserRepository userRepository;
    private final WeeklyChildStatsRepository weeklyChildStatsRepository;
    private final ChoreMapper choreMapper;
    private final ChoreSubmissionMapper submissionMapper;

    public ChoreService(ChoreRepository choreRepository,
                        ChoreSubmissionRepository submissionRepository,
                        FamilyRepository familyRepository,
                        UserRepository userRepository,
                        WeeklyChildStatsRepository weeklyChildStatsRepository,
                        ChoreMapper choreMapper,
                        ChoreSubmissionMapper submissionMapper) {
        this.choreRepository = choreRepository;
        this.submissionRepository = submissionRepository;
        this.familyRepository = familyRepository;
        this.userRepository = userRepository;
        this.weeklyChildStatsRepository = weeklyChildStatsRepository;
        this.choreMapper = choreMapper;
        this.submissionMapper = submissionMapper;
    }

    /**
     * Create a new chore in a family and optionally assign it to a child.
     */
    public ChoreDto createChore(CreateChoreRequestDto request, Parent creator) {
        Family family = getFamilyOrThrow(request.getFamilyId());
        verifyFamilyMember(family, creator);
        Chore chore = createChoreEntity(request, family, creator);
        assignChildIfProvided(chore, request, family);
        return choreMapper.toDto(saveChore(chore));
    }

    /**
     * Get a chore by its ID or throw 404 if not found.
     */
    public ChoreDto getChore(Long choreId) {
        return choreMapper.toDto(getChoreOrThrow(choreId));
    }

    /**
     * Get all chores for a given family.
     */
    public List<ChoreDto> getChoresForFamily(Long familyId) {
        getFamilyOrThrow(familyId);
        return choreRepository.findByFamily_Id(familyId)
                .stream()
                .map(choreMapper::toDto)
                .toList();
    }

    /**
     * Get all chores assigned to a specific child.
     */
    public List<ChoreDto> getChoresForChild(Long childId, User currentUser) {
        List<Chore> chores = choreRepository.findByAssignedTo_Id(childId);
        chores = filterChoresForUser(chores, currentUser, childId);
        return chores.stream()
                .map(choreMapper::toDto)
                .toList();
    }

    /**
     * Assign a chore to a specific child and update its status.
     */
    public ChoreDto assignChore(Long choreId, Long childId, Parent actor) {
        Chore chore = getChoreOrThrow(choreId);
        User user = getUserOrThrow(childId);
        verifyFamilyMember(chore.getFamily(), actor);
        verifyFamilyMember(chore.getFamily(), user);
        Child child = ensureChild(user);
        updateChoreAssignment(chore, child, ChoreStatus.NOT_STARTED);
        return choreMapper.toDto(chore);
    }

    /**
     * Submit a chore as a child, creating a submission entity and marking the chore DONE.
     * Returns the chore with updated status so the frontend can immediately reflect the change.
     */
    public ChoreDto submitChoreAndReturnChore(Long choreId, CreateChoreSubmissionDto request, Child submitter) {
        submitChore(choreId, request, submitter);
        Chore chore = getChoreOrThrow(choreId);
        return choreMapper.toDto(chore);
    }

    /**
     * Approve a chore submission and update the child's weekly stats accordingly.
     */
    public ChoreSubmissionDto approveSubmission(Long choreId, Long submissionId, Parent approver, String parentComment) {
        Chore chore = getChoreOrThrow(choreId);
        ChoreSubmission submission = getSubmissionOrThrow(submissionId);
        verifyFamilyMember(chore.getFamily(), approver);
        verifySubmissionBelongsToChore(submission, chore);
        ensureChoreNotAlreadyApproved(chore);
        updateSubmissionApproval(submission, true, parentComment);
        updateChoreStatus(chore, ChoreStatus.APPROVED);
        updateChildWeeklyStats(chore);
        return submissionMapper.toDto(submission);
    }

    /**
     * Reject a chore submission and reset the chore status to NOT_STARTED.
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
     * Delete a chore if the acting parent belongs to the family.
     */
    public void deleteChore(Long choreId, Parent actor) {
        Chore chore = getChoreOrThrow(choreId);
        verifyFamilyMember(chore.getFamily(), actor);
        choreRepository.delete(chore);
    }

    /**
     * HELPER: Get a chore by ID or throw 404 if not found.
     */
    private Chore getChoreOrThrow(Long choreId) {
        return choreRepository.findById(choreId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Chore not found"));
    }

    /**
     * HELPER: Get a family by ID or throw 404 if not found.
     */
    private Family getFamilyOrThrow(Long familyId) {
        return familyRepository.findById(familyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Family not found"));
    }

    /**
     * HELPER: Submit a chore as a child, creating a submission entity and marking the chore DONE.
     */
    private ChoreSubmissionDto submitChore(Long choreId, CreateChoreSubmissionDto request, Child submitter) {
        Chore chore = getChoreOrThrow(choreId);
        verifyAssignedChild(chore, submitter);
        ChoreSubmission submission = createSubmissionEntity(chore, request, submitter);
        ChoreSubmission saved = saveSubmission(submission);
        updateChoreStatus(chore, ChoreStatus.DONE);
        return submissionMapper.toDto(saved);
    }

    /**
     * HELPER: Filter chores based on the type of user.
     * CHILD users can only access their own chores.
     * PARENT users can only access chores in their family.
     */
    private List<Chore> filterChoresForUser(List<Chore> chores, User user, Long requestedChildId) {
        if (user instanceof Child child) {
            return filterChoresForChild(chores, child, requestedChildId);
        } else if (user instanceof Parent parent) {
            return filterChoresForParent(chores, parent);
        } else {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not authorized to see chores");
        }
    }

    /**
     * HELPER: CHILD can only see their own chores.
     * Throws 403 if child tries to access another child's chores.
     */
    private List<Chore> filterChoresForChild(List<Chore> chores, Child child, Long requestedChildId) {
        if (!child.getId().equals(requestedChildId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Children can only access their own chores");
        }
        return chores.stream()
                .filter(chore -> chore.getAssignedTo() != null && chore.getAssignedTo().getId().equals(child.getId()))
                .toList();
    }

    /**
     * HELPER: PARENT can only see chores belonging to their family.
     * Throws 403 if none of the chores belong to their family.
     */
    private List<Chore> filterChoresForParent(List<Chore> chores, Parent parent) {
        List<Chore> authorizedChores = chores.stream()
                .filter(chore -> chore.getFamily().getMembers().stream()
                        .anyMatch(member -> member.getId().equals(parent.getId())))
                .toList();

        if (authorizedChores.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to see these chores");
        }

        return authorizedChores;
    }

    /**
     * HELPER: Get a user by ID or throw 404 if not found.
     */
    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    /**
     * HELPER: Ensure the given user is a Child, else throw 403 Forbidden.
     */
    private Child ensureChild(User user) {
        if (!(user instanceof Child child)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not a child");
        }
        return child;
    }

    /**
     * HELPER: Get a submission by ID or throw 404 if not found.
     */
    private ChoreSubmission getSubmissionOrThrow(Long submissionId) {
        return submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Submission not found"));
    }

    /**
     * HELPER: Verify a user is a member of a given family, else throw 403.
     */
    private void verifyFamilyMember(Family family, User user) {
        boolean isMember = family.getMembers().stream()
                .anyMatch(member -> member.getId().equals(user.getId()));
        if (!isMember) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User must belong to the family");
    }

    /**
     * HELPER: Verify a chore is assigned to the provided child.
     */
    private void verifyAssignedChild(Chore chore, Child child) {
        if (chore.getAssignedTo() == null || !chore.getAssignedTo().getId().equals(child.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This chore is not assigned to you");
        }
    }

    /**
     * HELPER: Verify a submission belongs to a chore, else throw 400.
     */
    private void verifySubmissionBelongsToChore(ChoreSubmission submission, Chore chore) {
        if (!submission.getChore().getId().equals(chore.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Submission does not belong to chore");
        }
    }

    /**
     * HELPER: Ensure the chore is not already approved.
     * Throws 400 Bad Request if chore is already approved.
     */
    private void ensureChoreNotAlreadyApproved(Chore chore) {
        if (chore.getStatus() == ChoreStatus.APPROVED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chore is already approved");
        }
    }

    /**
     * HELPER: Create a Chore entity from the DTO and set timestamps.
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
     * HELPER: Create a ChoreSubmission entity from DTO and set timestamps.
     */
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
     * HELPER: Save a chore to the repository.
     */
    private Chore saveChore(Chore chore) {
        return choreRepository.save(chore);
    }

    /**
     * HELPER: Save a submission to the repository.
     */
    private ChoreSubmission saveSubmission(ChoreSubmission submission) {
        return submissionRepository.save(submission);
    }

    /**
     * HELPER: Assign a child to a chore if provided in the request and update its status.
     */
    private void assignChildIfProvided(Chore chore, CreateChoreRequestDto request, Family family) {
        if (request.getAssignedChildId() != null) {
            User user = getUserOrThrow(request.getAssignedChildId());
            verifyFamilyMember(family, user);

            Child child = ensureChild(user);
            updateChoreAssignment(chore, child, ChoreStatus.NOT_STARTED);
        }
    }

    /**
     * HELPER: Update chore assignment and timestamp.
     */
    private void updateChoreAssignment(Chore chore, Child child, ChoreStatus status) {
        chore.setAssignedTo(child);
        chore.setStatus(status);
        chore.setUpdatedAt(Instant.now());
        saveChore(chore);
    }

    /**
     * HELPER: Approve or reject a submission and save changes.
     */
    private void updateSubmissionApproval(ChoreSubmission submission, boolean approved, String parentComment) {
        submission.setApprovedByParent(approved);
        submission.setCommentParent(parentComment);
        saveSubmission(submission);
    }

    /**
     * HELPER: Update chore status and timestamp.
     */
    private void updateChoreStatus(Chore chore, ChoreStatus status) {
        chore.setStatus(status);
        chore.setUpdatedAt(Instant.now());
        saveChore(chore);
    }

    /**
     * HELPER: Update weekly stats for a child when a chore is completed.
     */
    private void updateChildWeeklyStats(Chore chore) {
        if (chore.getAssignedTo() == null || chore.getValue() == null) return;

        WeeklyChildStats stats = getOrCreateWeeklyStats(chore.getAssignedTo(), chore.getFamily());
        incrementWeeklyStats(stats, chore.getValue());
    }

    /**
     * HELPER: Get or create weekly stats for a child and family for the current week/year.
     */
    private WeeklyChildStats getOrCreateWeeklyStats(Child child, Family family) {
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
                    dto.setEarnedCoins(java.math.BigDecimal.ZERO);
                    return weeklyChildStatsRepository.save(WeeklyChildStatsMapper.fromDto(dto, child, family));
                });
    }

    /**
     * HELPER: Increment completed chores and earned coins for weekly stats.
     */
    private void incrementWeeklyStats(WeeklyChildStats stats, java.math.BigDecimal value) {
        stats.setCompletedChoresCount(stats.getCompletedChoresCount() + 1);
        stats.setEarnedCoins(stats.getEarnedCoins().add(value));
        weeklyChildStatsRepository.save(stats);
    }
}