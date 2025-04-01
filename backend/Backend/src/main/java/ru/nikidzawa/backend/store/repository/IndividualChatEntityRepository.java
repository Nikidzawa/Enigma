package ru.nikidzawa.backend.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.nikidzawa.backend.store.entity.IndividualChatEntity;

import java.util.Optional;

@Repository
public interface IndividualChatEntityRepository extends JpaRepository<IndividualChatEntity, Long> {
    Optional<IndividualChatEntity> findByOwnerIdAndCompanionId(Long ownerId, Long companionId);
}
