package ru.nikidzawa.db.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.nikidzawa.db.store.entity.IndividualEntity;

import java.util.Optional;

@Repository
public interface UserEntityRepository extends JpaRepository<IndividualEntity, Long> {
    Optional<IndividualEntity> findFirstByNicknameAndPassword(String username, String password);
    Optional<IndividualEntity> findFirstById(Long id);
}
