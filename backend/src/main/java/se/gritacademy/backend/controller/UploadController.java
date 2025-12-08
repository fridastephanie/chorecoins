package se.gritacademy.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import se.gritacademy.backend.entity.user.User;
import se.gritacademy.backend.service.api.UploadService;

@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
public class UploadController {

    private final UploadService uploadService;

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public String uploadImage(@RequestParam("file") MultipartFile file) throws Exception {
        return uploadService.uploadFile(file);
    }

    @GetMapping("/image/{fileName}")
    @PreAuthorize("hasAnyRole('CHILD','PARENT')")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<byte[]> getImage(
            @PathVariable String fileName,
            @AuthenticationPrincipal User actor
    ) throws Exception {
        return uploadService.getImage(fileName, actor);
    }
}