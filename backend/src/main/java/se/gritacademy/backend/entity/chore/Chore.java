package se.gritacademy.backend.entity.chore;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import se.gritacademy.backend.entity.family.Family;
import se.gritacademy.backend.entity.user.Child;
import se.gritacademy.backend.entity.user.Parent;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "chores")
public class Chore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(length = 50, nullable = false)
    @Size(max = 50)
    private String title;

    @Column(length = 200)
    @Size(max = 200)
    private String description;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private BigDecimal value;

    @Enumerated(EnumType.STRING)
    private ChoreStatus status = ChoreStatus.NOT_STARTED;

    @ManyToOne
    @JoinColumn(name = "assigned_child_id")
    private Child assignedTo;

    @ManyToOne
    @JoinColumn(name = "created_by_parent_id")
    private Parent createdBy;

    @ManyToOne
    @JoinColumn(name = "family_id", nullable = false)
    private Family family;

    @FutureOrPresent
    private LocalDate dueDate;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    @OneToMany(mappedBy = "chore", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ChoreSubmission> submissions = new HashSet<>();
}