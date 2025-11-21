package se.gritacademy.backend.mapper;

import org.springframework.stereotype.Component;
import se.gritacademy.backend.dto.chore.ChoreSubmissionDto;
import se.gritacademy.backend.entity.chore.ChoreSubmission;

@Component
public class ChoreSubmissionMapper {

    public ChoreSubmissionDto toDto(ChoreSubmission submission) {
        if (submission == null) return null;
        ChoreSubmissionDto dto = new ChoreSubmissionDto();
        dto.setId(submission.getId());
        dto.setCommentChild(submission.getCommentChild());
        dto.setImageUrls(submission.getImageUrls());
        dto.setSubmittedAt(submission.getSubmittedAt());
        dto.setSubmittedByUserId(submission.getSubmittedBy() != null ? submission.getSubmittedBy().getId() : null);
        dto.setApprovedByParent(submission.isApprovedByParent());
        dto.setCommentParent(submission.getCommentParent());
        return dto;
    }
}