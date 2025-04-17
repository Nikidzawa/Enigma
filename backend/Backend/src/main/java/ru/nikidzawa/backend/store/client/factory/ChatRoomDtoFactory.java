package ru.nikidzawa.backend.store.client.factory;

import org.springframework.stereotype.Component;
import ru.nikidzawa.backend.store.client.dataModel.ChatRoomDataModel;
import ru.nikidzawa.backend.store.client.dto.ChatRoomDto;
import ru.nikidzawa.backend.store.client.dto.IndividualDtoShort;
import ru.nikidzawa.backend.store.client.dto.MessageDto;
import ru.nikidzawa.backend.store.entity.IndividualChatEntity;

import java.util.ArrayList;
import java.util.List;

@Component
public class ChatRoomDtoFactory {
    public ChatRoomDto convert (ChatRoomDataModel chatRoomDataModel) {
        return ChatRoomDto.builder()
                .companion(IndividualDtoShort.builder()
                        .id(chatRoomDataModel.getUserId())
                        .nickname(chatRoomDataModel.getUserNickname())
                        .name(chatRoomDataModel.getUserName())
                        .surname(chatRoomDataModel.getUserSurname())
                        .birthdate(chatRoomDataModel.getBirthdate())
                        .aboutMe(chatRoomDataModel.getAboutMe())
                        .avatarHref(chatRoomDataModel.getAvatarHref())
                        .build()
                ).messages(chatRoomDataModel.getLastMessageId() == 0 ? new ArrayList<>() : List.of(
                        MessageDto.builder()
                                .id(chatRoomDataModel.getLastMessageId())
                                .createdAt(chatRoomDataModel.getLastMessageSendTime())
                                .text(chatRoomDataModel.getLastMessageText())
                                .senderId(chatRoomDataModel.getLastMessageSenderId())
                                .isRead(chatRoomDataModel.getLastMessageIsRead())
                                .build()
                        )
                ).chat(IndividualChatEntity.builder()
                        .id(chatRoomDataModel.getChatId())
                        .ownerId(chatRoomDataModel.getOwnerId())
                        .companionId(chatRoomDataModel.getCompanionId())
                        .createdAt(chatRoomDataModel.getCreatedAt())
                        .build())
                .unreadCount(chatRoomDataModel.getUnreadCount())
                .build();
    }
}
