package se.gritacademy.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import se.gritacademy.backend.entity.user.Child;
import se.gritacademy.backend.entity.user.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("SELECT c FROM Child c LEFT JOIN FETCH c.families")
    List<Child> findAllChildrenWithFamilies();

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.families WHERE u.id = :id")
    Optional<User> findByIdWithFamilies(Long id);
}