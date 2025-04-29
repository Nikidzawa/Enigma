package ru.nikidzawa.backend.store.client.factory;

import org.springframework.stereotype.Component;
import ru.nikidzawa.backend.store.client.dataModel.ChatRoomDataModel;
import ru.nikidzawa.backend.store.client.dto.PrivateChatRoomDto;
import ru.nikidzawa.backend.store.client.dto.IndividualDtoShort;
import ru.nikidzawa.backend.store.client.dto.MessageDto;
import ru.nikidzawa.backend.store.entity.PrivateChatEntity;

import java.util.ArrayList;
import java.util.List;

@Component
public class ChatRoomDtoFactory {
    public PrivateChatRoomDto convert (ChatRoomDataModel model) {
        return PrivateChatRoomDto.builder()
                .companion(IndividualDtoShort.builder()
                        .id(model.getIndividualId())
                        .avatarHref(model.getAvatarHref())
                        .name(model.getName())
                        .nickname(model.getNickname())
                        .surname(model.getSurname())
                        .aboutMe(model.getAboutMe())
                        .birthdate(model.getBirthDate())
                        .lastLogoutDate(model.getLastLogoutDt())
                        .build()
                ).messages(model.getLastMessageId() == 0 ? new ArrayList<>() : List.of(
                        MessageDto.builder()
                                .id(model.getLastMessageId())
                                .senderId(model.getSenderId())
                                .sentAt(model.getSentAt())
                                .text(model.getText())
                                .isPinned(model.getIsPinned())
                                .isEdited(model.getIsEdited())
                                .editedAt(model.getEditedAt())
                                .isRead(model.getIsRead())
                                .build()
                        )
                ).chat(PrivateChatEntity.builder()
                        .chatId(model.getChatId())
                        .ownerId(model.getOwnerId())
                        .companionId(model.getIndividualId())
                        .build())
                .unreadCount(model.getUnreadCount())
                .build();
    }
}
