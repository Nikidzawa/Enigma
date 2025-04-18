package ru.nikidzawa.backend.store.client.factory;

import org.springframework.stereotype.Component;
import ru.nikidzawa.backend.store.client.dto.IndividualDtoShort;
import ru.nikidzawa.backend.store.entity.IndividualEntity;

/**
 * @author Nikidzawa
 */
@Component
public class IndividualDtoFactory {

    public IndividualDtoShort convert(IndividualEntity individualEntity) {
        return IndividualDtoShort.builder()
                .id(individualEntity.getId())
                .name(individualEntity.getName())
                .surname(individualEntity.getSurname())
                .nickname(individualEntity.getNickname())
                .birthdate(individualEntity.getBirthdate())
                .aboutMe(individualEntity.getAboutMe())
                .avatarHref(individualEntity.getAvatarHref())
                .lastLogoutDate(individualEntity.getLastLogoutDate())
                .build();
    }
}
