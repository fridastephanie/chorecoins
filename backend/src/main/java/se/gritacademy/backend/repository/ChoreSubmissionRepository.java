package se.gritacademy.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.gritacademy.backend.entity.chore.ChoreSubmission;


public interface ChoreSubmissionRepository extends JpaRepository<ChoreSubmission, Long> {

}