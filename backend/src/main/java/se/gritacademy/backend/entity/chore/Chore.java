package se.gritacademy.backend.entity.chore;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import se.gritacademy.backend.entity.user.Child;
import se.gritacademy.backend.entity.user.Parent;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "chores")
public class Chore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 2000)
    private String description;

    private BigDecimal value;

    @Enumerated(EnumType.STRING)
    private ChoreStatus status = ChoreStatus.NOT_STARTED;

    @ManyToOne
    @JoinColumn(name = "assigned_child_id")
    private Child assignedChild;

    @ManyToOne
    @JoinColumn(name = "created_by_parent_id")
    private Parent createdBy;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    @OneToMany(mappedBy = "chore", cascade = CascadeType.ALL)
    private List<ChoreImage> images = new ArrayList<>();
}
