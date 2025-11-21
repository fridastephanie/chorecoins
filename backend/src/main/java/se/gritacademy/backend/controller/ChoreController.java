package se.gritacademy.backend.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import se.gritacademy.backend.dto.chore.*;
import se.gritacademy.backend.entity.user.Child;
import se.gritacademy.backend.entity.user.Parent;
import se.gritacademy.backend.service.ChoreService;

import java.util.List;

@RestController
@RequestMapping("/api/chores")
public class ChoreController {

    private final ChoreService choreService;

    public ChoreController(ChoreService choreService) {
        this.choreService = choreService;
    }

    @PostMapping
    @PreAuthorize("hasRole('PARENT')")
    @ResponseStatus(HttpStatus.CREATED)
    public ChoreDto createChore(@Valid @RequestBody CreateChoreRequestDto request,
                                @AuthenticationPrincipal Parent creator) {
        return choreService.createChore(request, creator);
    }

    @GetMapping("/family/{familyId}")
    @PreAuthorize("hasAnyRole('PARENT','CHILD')")
    @ResponseStatus(HttpStatus.OK)
    public List<ChoreDto> getChoresForFamily(@PathVariable Long familyId) {
        return choreService.getChoresForFamily(familyId);
    }

    @GetMapping("/{choreId}")
    @PreAuthorize("hasAnyRole('PARENT','CHILD')")
    @ResponseStatus(HttpStatus.OK)
    public ChoreDto getChore(@PathVariable Long choreId) {
        return choreService.getChore(choreId);
    }

    @PostMapping("/{choreId}/assign/{childId}")
    @PreAuthorize("hasRole('PARENT')")
    @ResponseStatus(HttpStatus.OK)
    public ChoreDto assignChore(@PathVariable Long choreId,
                                @PathVariable Long childId,
                                @AuthenticationPrincipal Parent actor) {
        return choreService.assignChore(choreId, childId, actor);
    }

    @PostMapping("/{choreId}/submit")
    @PreAuthorize("hasRole('CHILD')")
    @ResponseStatus(HttpStatus.CREATED)
    public ChoreSubmissionDto submitChore(@PathVariable Long choreId,
                                          @Valid @RequestBody CreateChoreSubmissionDto request,
                                          @AuthenticationPrincipal Child submitter) {
        return choreService.submitChore(choreId, request, submitter);
    }

    @PatchMapping("/{choreId}/submissions/{submissionId}/approve")
    @PreAuthorize("hasRole('PARENT')")
    @ResponseStatus(HttpStatus.OK)
    public ChoreSubmissionDto approveSubmission(
            @PathVariable Long choreId,
            @PathVariable Long submissionId,
            @AuthenticationPrincipal Parent approver,
            @Valid @RequestBody ApproveChoreSubmissionRequestDto request) {

        return choreService.approveSubmission(choreId, submissionId, approver, request.getCommentParent());
    }

    @PatchMapping("/{choreId}/submissions/{submissionId}/reject")
    @PreAuthorize("hasRole('PARENT')")
    @ResponseStatus(HttpStatus.OK)
    public ChoreSubmissionDto rejectSubmission(
            @PathVariable Long choreId,
            @PathVariable Long submissionId,
            @AuthenticationPrincipal Parent approver,
            @Valid @RequestBody RejectChoreSubmissionRequestDto request) {

        return choreService.rejectSubmission(choreId, submissionId, approver, request.getCommentParent());
    }

    @DeleteMapping("/{choreId}")
    @PreAuthorize("hasRole('PARENT')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteChore(@PathVariable Long choreId,
                            @AuthenticationPrincipal Parent actor) {
        choreService.deleteChore(choreId, actor);
    }
}