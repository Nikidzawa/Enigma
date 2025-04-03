package ru.nikidzawa.backend.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.nikidzawa.backend.store.entity.IndividualPresenceEntity;

/**
 * @author Nikidzawa
 */
public interface IndividualPresenceRepository extends JpaRepository<IndividualPresenceEntity, Long> {
}
