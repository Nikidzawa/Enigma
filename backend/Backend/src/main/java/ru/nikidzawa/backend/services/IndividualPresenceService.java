package ru.nikidzawa.backend.services;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import ru.nikidzawa.backend.exceptions.NotFoundException;
import ru.nikidzawa.backend.store.entity.IndividualPresenceEntity;
import ru.nikidzawa.backend.store.repository.IndividualPresenceRepository;

/**
 * @author Nikidzawa
 */
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class IndividualPresenceService {

    IndividualPresenceRepository individualPresenceRepository;

    public void create (IndividualPresenceEntity individualPresenceEntity) {
        individualPresenceRepository.saveAndFlush(individualPresenceEntity);
    }

    public IndividualPresenceEntity getActual (Long userId) {
        return individualPresenceRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(""));
    }

}
