package se.gritacademy.backend.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import se.gritacademy.backend.dto.family.CreateFamilyRequestDto;
import se.gritacademy.backend.dto.family.FamilyDto;
import se.gritacademy.backend.entity.user.Parent;
import se.gritacademy.backend.entity.user.User;
import se.gritacademy.backend.service.FamilyService;

@RestController
@RequestMapping("/api/families")
public class FamilyController {

    private final FamilyService familyService;

    public FamilyController(FamilyService familyService) {
        this.familyService = familyService;
    }

    @PostMapping
    @PreAuthorize("hasRole('PARENT')")
    @ResponseStatus(HttpStatus.CREATED)
    public FamilyDto createFamily(@Valid @RequestBody CreateFamilyRequestDto request,
                                  @AuthenticationPrincipal Parent creator) {
        return familyService.createFamily(request, creator);
    }

    @PostMapping("/{familyId}/members/{userId}")
    @PreAuthorize("hasRole('PARENT')")
    @ResponseStatus(HttpStatus.OK)
    public FamilyDto addMember(@PathVariable Long familyId,
                               @PathVariable Long userId,
                               @AuthenticationPrincipal Parent actor) {
        return familyService.addMember(familyId, userId, actor);
    }

    @DeleteMapping("/{familyId}/members/{userId}")
    @PreAuthorize("hasRole('PARENT')")
    @ResponseStatus(HttpStatus.OK)
    public FamilyDto removeMember(@PathVariable Long familyId,
                                  @PathVariable Long userId,
                                  @AuthenticationPrincipal Parent actor) {
        return familyService.removeMember(familyId, userId, actor);
    }

    @PatchMapping("/{familyId}")
    @PreAuthorize("hasRole('PARENT')")
    @ResponseStatus(HttpStatus.OK)
    public FamilyDto updateFamilyName(@PathVariable Long familyId,
                                      @RequestBody CreateFamilyRequestDto request,
                                      @AuthenticationPrincipal Parent actor) {
        return familyService.updateFamilyName(familyId, request.getFamilyName(), actor);
    }

    @DeleteMapping("/{familyId}")
    @PreAuthorize("hasRole('PARENT')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFamily(@PathVariable Long familyId,
                             @AuthenticationPrincipal Parent actor) {
        familyService.deleteFamily(familyId, actor);
    }

    @GetMapping("/{familyId}")
    @PreAuthorize("hasAnyRole('PARENT', 'CHILD')")
    @ResponseStatus(HttpStatus.OK)
    public FamilyDto getFamily(@PathVariable Long familyId,
                               @AuthenticationPrincipal User actor) {
        return familyService.getFamily(familyId, actor);
    }
}