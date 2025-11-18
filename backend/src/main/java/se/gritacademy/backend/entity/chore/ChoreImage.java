package se.gritacademy.backend.entity.chore;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "chore_images")
public class ChoreImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String storagePath;

    private String comment;

    private Instant uploadedAt = Instant.now();

    @ManyToOne
    @JoinColumn(name = "chore_id")
    private Chore chore;
}