package se.gritacademy.backend.dto.chore;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.Set;

@Getter
@Setter
public class ChoreSubmissionDto {
    private Long id;
    private String commentChild;
    private Set<String> imageUrls;
    private Long submittedByUserId;
    private Instant submittedAt;
    private boolean approvedByParent;
    private String commentParent;
}