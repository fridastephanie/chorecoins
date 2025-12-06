package se.gritacademy.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import se.gritacademy.backend.entity.chore.Chore;
import se.gritacademy.backend.entity.chore.ChoreSubmission;
import se.gritacademy.backend.entity.user.User;
import se.gritacademy.backend.repository.ChoreSubmissionRepository;
import se.gritacademy.backend.repository.UserRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UploadService {

    @Value("${SUPABASE_SERVICE_ROLE_KEY}")
    private String supabaseKey;

    @Value("${SUPABASE_URL}")
    private String supabaseUrl;

    @Value("${SUPABASE_BUCKET}")
    private String bucketName;

    private final ChoreSubmissionRepository choreSubmissionRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Upload a file to Supabase and return its unique file name.
     */
    public String uploadFile(MultipartFile file) throws Exception {
        String fileName = generateFileName(file);
        HttpEntity<byte[]> entity = createUploadEntity(file);
        String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + fileName;
        try {
            restTemplate.exchange(uploadUrl, HttpMethod.PUT, entity, String.class);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload file");
        }
        return fileName;
    }

    /**
     * Retrieve a file from Supabase with proper access checks.
     */
    public ResponseEntity<byte[]> getImage(String fileName, User actor) throws Exception {
        User user = loadUser(actor);
        ChoreSubmission submission = loadSubmission(fileName);
        verifyAccess(user, submission.getChore());
        byte[] fileBytes = downloadFile(fileName);
        MediaType mediaType = determineMediaType(fileName);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        return new ResponseEntity<>(fileBytes, headers, HttpStatus.OK);
    }

    // ----------------- PRIVATE HELPERS -----------------

    /**
     * Generate a unique file name for the uploaded file.
     */
    private String generateFileName(MultipartFile file) {
        return UUID.randomUUID() + "-" + file.getOriginalFilename();
    }

    /**
     * Create an HttpEntity with file bytes and proper headers for upload.
     */
    private HttpEntity<byte[]> createUploadEntity(MultipartFile file) throws Exception {
        String contentType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", supabaseKey);
        headers.set("Authorization", "Bearer " + supabaseKey);
        headers.setContentType(MediaType.parseMediaType(contentType));
        return new HttpEntity<>(file.getBytes(), headers);
    }

    /**
     * Download file bytes from Supabase storage.
     */
    private byte[] downloadFile(String fileName) throws Exception {
        String fileUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + fileName;
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", supabaseKey);
        headers.set("Authorization", "Bearer " + supabaseKey);
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<byte[]> response = restTemplate.exchange(fileUrl, HttpMethod.GET, entity, byte[].class);
        if (response.getBody() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found");
        }
        return response.getBody();
    }

    /**
     * Load a user along with their families from the database.
     */
    private User loadUser(User actor) {
        return userRepository.findByIdWithFamilies(actor.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    /**
     * Load a chore submission by its image file name.
     */
    private ChoreSubmission loadSubmission(String fileName) {
        return choreSubmissionRepository.findByImageFileName(fileName)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found"));
    }

    /**
     * Verify that the user belongs to the family associated with the chore.
     */
    private void verifyAccess(User user, Chore chore) {
        if (!user.getFamilies().contains(chore.getFamily())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User does not belong to this family");
        }
    }

    /**
     * Determine the MediaType based on the file extension.
     */
    private MediaType determineMediaType(String fileName) {
        String extension = "";
        int i = fileName.lastIndexOf('.');
        if (i > 0) extension = fileName.substring(i + 1).toLowerCase();

        return switch (extension) {
            case "png" -> MediaType.IMAGE_PNG;
            case "webp" -> MediaType.valueOf("image/webp");
            case "jpg", "jpeg" -> MediaType.IMAGE_JPEG;
            default -> MediaType.APPLICATION_OCTET_STREAM;
        };
    }
}