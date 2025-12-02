package se.gritacademy.backend.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import se.gritacademy.backend.dto.chore.*;
import se.gritacademy.backend.entity.user.Child;
import se.gritacademy.backend.entity.user.Parent;
import se.gritacademy.backend.entity.user.User;
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
                                @AuthenticationPrincipal User creater) {
        Parent parent = se.gritacademy.backend.security.SecurityUtils.requireParent(creater);
        return choreService.createChore(request, parent);
    }

    @GetMapping("/family/{familyId}")
    @PreAuthorize("hasAnyRole('PARENT','CHILD')")
    @ResponseStatus(HttpStatus.OK)
    public List<ChoreDto> getChoresForFamily(@PathVariable Long familyId) {
        return choreService.getChoresForFamily(familyId);
    }

    @GetMapping("/child/{childId}")
    @PreAuthorize("hasAnyRole('PARENT','CHILD')")
    @ResponseStatus(HttpStatus.OK)
    public List<ChoreDto> getChoresForChild(@PathVariable Long childId,
                                            @AuthenticationPrincipal User user) {
        return choreService.getChoresForChild(childId, user);
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
                                @AuthenticationPrincipal User actor) {
        Parent parent = se.gritacademy.backend.security.SecurityUtils.requireParent(actor);
        return choreService.assignChore(choreId, childId, parent);
    }

    @PostMapping("/{choreId}/submit")
    @PreAuthorize("hasRole('CHILD')")
    @ResponseStatus(HttpStatus.CREATED)
    public ChoreDto submitChore(@PathVariable Long choreId,
                                @Valid @RequestBody CreateChoreSubmissionDto request,
                                @AuthenticationPrincipal User submitter) {
        Child child = se.gritacademy.backend.security.SecurityUtils.requireChild(submitter);
        return choreService.submitChoreAndReturnChore(choreId, request, child);
    }

    @PatchMapping("/{choreId}/submissions/{submissionId}/approve")
    @PreAuthorize("hasRole('PARENT')")
    @ResponseStatus(HttpStatus.OK)
    public ChoreSubmissionDto approveSubmission(
            @PathVariable Long choreId,
            @PathVariable Long submissionId,
            @AuthenticationPrincipal User approver,
            @Valid @RequestBody ApproveChoreSubmissionRequestDto request) {
        Parent parent = se.gritacademy.backend.security.SecurityUtils.requireParent(approver);
        return choreService.approveSubmission(choreId, submissionId, parent, request.getCommentParent());
    }

    @PatchMapping("/{choreId}/submissions/{submissionId}/reject")
    @PreAuthorize("hasRole('PARENT')")
    @ResponseStatus(HttpStatus.OK)
    public ChoreSubmissionDto rejectSubmission(
            @PathVariable Long choreId,
            @PathVariable Long submissionId,
            @AuthenticationPrincipal User approver,
            @Valid @RequestBody RejectChoreSubmissionRequestDto request) {
        Parent parent = se.gritacademy.backend.security.SecurityUtils.requireParent(approver);
        return choreService.rejectSubmission(choreId, submissionId, parent, request.getCommentParent());
    }

    @DeleteMapping("/{choreId}")
    @PreAuthorize("hasRole('PARENT')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteChore(@PathVariable Long choreId,
                            @AuthenticationPrincipal User actor) {
        Parent parent = se.gritacademy.backend.security.SecurityUtils.requireParent(actor);
        choreService.deleteChore(choreId, parent);
    }
}