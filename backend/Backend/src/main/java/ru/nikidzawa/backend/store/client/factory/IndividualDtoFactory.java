package ru.nikidzawa.backend.store.client.factory;

import org.springframework.stereotype.Component;
import ru.nikidzawa.backend.store.client.dataModel.ChatRoomDataModel;
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

    public IndividualDtoShort convertFromDataModel(ChatRoomDataModel m) {
        return IndividualDtoShort.builder()
                .id(m.getIndividualId())
                .avatarHref(m.getAvatarHref())
                .name(m.getName())
                .nickname(m.getNickname())
                .surname(m.getSurname())
                .aboutMe(m.getAboutMe())
                .birthdate(m.getBirthDate())
                .lastLogoutDate(m.getLastLogoutDt())
                .build();
    }
}
