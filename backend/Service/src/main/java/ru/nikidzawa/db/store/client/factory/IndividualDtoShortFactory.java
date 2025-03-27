package ru.nikidzawa.db.store.client.factory;

import ru.nikidzawa.db.store.client.dto.IndividualDtoShort;
import ru.nikidzawa.db.store.entity.IndividualEntity;

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
                .avatarHref(individualEntity.getAvatarHref())
                .build();
    }
}
