package se.gritacademy.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import se.gritacademy.backend.entity.chore.ChoreSubmission;

import java.util.Optional;

public interface ChoreSubmissionRepository extends JpaRepository<ChoreSubmission, Long> {

    @Query("SELECT cs FROM ChoreSubmission cs JOIN cs.imageUrls img WHERE img = :fileName")
    Optional<ChoreSubmission> findByImageFileName(@Param("fileName") String fileName);
}