package se.gritacademy.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import se.gritacademy.backend.dto.family.CreateFamilyRequestDto;
import se.gritacademy.backend.dto.family.FamilyDto;
import se.gritacademy.backend.entity.user.Parent;
import se.gritacademy.backend.entity.user.User;
import se.gritacademy.backend.service.api.FamilyService;

@RestController
@RequestMapping("/api/families")
@RequiredArgsConstructor
public class FamilyController {

    private final FamilyService familyService;

    @PostMapping
    @PreAuthorize("hasRole('PARENT')")
    @ResponseStatus(HttpStatus.CREATED)
    public FamilyDto createFamily(@Valid @RequestBody CreateFamilyRequestDto request,
                                  @AuthenticationPrincipal User creator) {
        Parent parent = se.gritacademy.backend.security.SecurityUtils.requireParent(creator);
        return familyService.createFamily(request, parent);
    }

    @PostMapping("/{familyId}/members/{userId}")
    @PreAuthorize("hasRole('PARENT')")
    @ResponseStatus(HttpStatus.OK)
    public FamilyDto addMember(@PathVariable Long familyId,
                               @PathVariable Long userId,
                               @AuthenticationPrincipal User actor) {
        Parent parent = se.gritacademy.backend.security.SecurityUtils.requireParent(actor);
        return familyService.addMember(familyId, userId, parent);
    }

    @DeleteMapping("/{familyId}/members/{userId}")
    @PreAuthorize("hasRole('PARENT')")
    @ResponseStatus(HttpStatus.OK)
    public FamilyDto removeMember(@PathVariable Long familyId,
                                  @PathVariable Long userId,
                                  @AuthenticationPrincipal User actor) {
        Parent parent = se.gritacademy.backend.security.SecurityUtils.requireParent(actor);
        return familyService.removeMember(familyId, userId, parent);
    }

    @PatchMapping("/{familyId}")
    @PreAuthorize("hasRole('PARENT')")
    @ResponseStatus(HttpStatus.OK)
    public FamilyDto updateFamilyName(@PathVariable Long familyId,
                                      @RequestBody CreateFamilyRequestDto request,
                                      @AuthenticationPrincipal User actor) {
        Parent parent = se.gritacademy.backend.security.SecurityUtils.requireParent(actor);
        return familyService.updateFamilyName(familyId, request.getFamilyName(), parent);
    }

    @DeleteMapping("/{familyId}")
    @PreAuthorize("hasRole('PARENT')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFamily(@PathVariable Long familyId,
                             @AuthenticationPrincipal User actor) {
        Parent parent = se.gritacademy.backend.security.SecurityUtils.requireParent(actor);
        familyService.deleteFamily(familyId, parent);
    }

    @GetMapping("/{familyId}")
    @PreAuthorize("hasAnyRole('PARENT', 'CHILD')")
    @ResponseStatus(HttpStatus.OK)
    public FamilyDto getFamily(@PathVariable Long familyId,
                               @AuthenticationPrincipal User actor) {
        return familyService.getFamily(familyId, actor);
    }
}