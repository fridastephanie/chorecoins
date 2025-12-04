package se.gritacademy.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.gritacademy.backend.entity.chore.Chore;
import se.gritacademy.backend.entity.chore.ChoreStatus;

import java.time.LocalDate;
import java.util.List;

public interface ChoreRepository extends JpaRepository<Chore, Long> {
    List<Chore> findByFamily_Id(Long familyId);
    List<Chore> findByAssignedTo_Id(Long childId);
    List<Chore> findByDueDateBefore(LocalDate date);
    List<Chore> findByStatus(ChoreStatus status);
}
