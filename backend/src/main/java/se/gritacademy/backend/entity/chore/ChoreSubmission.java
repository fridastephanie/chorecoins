package se.gritacademy.backend.entity.chore;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import se.gritacademy.backend.entity.user.Child;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "chore_submissions")
public class ChoreSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 2000)
    private String commentChild;

    @ElementCollection
    @CollectionTable(name = "chore_submission_images", joinColumns = @JoinColumn(name = "submission_id"))
    @Column(name = "image_url", length = 2000)
    private Set<String> imageUrls = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "chore_id")
    private Chore chore;

    @ManyToOne
    @JoinColumn(name = "submitted_by_child_id")
    private Child submittedBy;

    private Instant submittedAt = Instant.now();

    private boolean approvedByParent = false;

    @Column(length = 2000)
    private String commentParent;
}
