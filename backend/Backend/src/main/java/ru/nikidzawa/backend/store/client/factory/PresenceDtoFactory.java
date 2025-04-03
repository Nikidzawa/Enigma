package ru.nikidzawa.backend.store.client.factory;

import org.springframework.stereotype.Component;
import ru.nikidzawa.backend.store.client.dto.PresenceDto;
import ru.nikidzawa.backend.store.entity.IndividualPresenceEntity;

/**
 * @author Nikidzawa
 */
@Component
public class PresenceDtoFactory {
    public PresenceDto convert (IndividualPresenceEntity presenceEntity) {
        return PresenceDto.builder()
                .individualId(presenceEntity.getIndividualId())
                .isOnline(presenceEntity.getIsOnline())
                .lastOnlineDate(presenceEntity.getLastOnlineDate())
                .build();
    }
}
