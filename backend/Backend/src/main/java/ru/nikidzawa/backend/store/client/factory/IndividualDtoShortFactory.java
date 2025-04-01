package ru.nikidzawa.backend.store.client.factory;

import ru.nikidzawa.backend.store.client.dto.IndividualDtoShort;
import ru.nikidzawa.backend.store.entity.IndividualEntity;

/**
 * @author Nikidzawa
 */
public class IndividualDtoShortFactory {
    public static IndividualDtoShort convert(IndividualEntity individualEntity) {
        return IndividualDtoShort.builder()
                .id(individualEntity.getId())
                .name(individualEntity.getName())
                .surname(individualEntity.getSurname())
                .nickname(individualEntity.getNickname())
                .birthdate(individualEntity.getBirthdate())
                .aboutMe(individualEntity.getAboutMe())
                .avatarHref(individualEntity.getAvatarHref())
                .lastOnline(individualEntity.getLastOnline())
                .build();
    }
}
