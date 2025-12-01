package se.gritacademy.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.gritacademy.backend.entity.family.Family;

import java.util.List;

public interface FamilyRepository extends JpaRepository<Family, Long> {
    List<Family> findAllByMembers_Id(Long userId);
}