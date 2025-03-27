package ru.nikidzawa.db.store.client.factory;

import org.springframework.stereotype.Component;
import ru.nikidzawa.db.store.client.dataModel.ChatRoomDataModel;
import ru.nikidzawa.db.store.client.dto.ChatRoomDto;
import ru.nikidzawa.db.store.client.dto.IndividualDtoShort;
import ru.nikidzawa.db.store.client.dto.MessageDto;
import ru.nikidzawa.db.store.entity.IndividualChatEntity;
import ru.nikidzawa.db.store.entity.IndividualEntity;

@Component
public class ChatRoomDtoFactory {
    public ChatRoomDto convert (ChatRoomDataModel chatRoomDataModel) {
        return ChatRoomDto.builder()
                .companion(IndividualDtoShort.builder()
                        .id(chatRoomDataModel.getUserId())
                        .nickname(chatRoomDataModel.getUserNickname())
                        .name(chatRoomDataModel.getUserName())
                        .surname(chatRoomDataModel.getUserSurname())
                        .avatarHref(chatRoomDataModel.getAvatarHref())
                        .build()
                ).lastMessage(chatRoomDataModel.getLastMessageId() == 0 ? null :
                        MessageDto.builder()
                                .id(chatRoomDataModel.getLastMessageId())
                                .createdAt(chatRoomDataModel.getLastMessageSendTime())
                                .text(chatRoomDataModel.getLastMessageText())
                                .senderId(chatRoomDataModel.getLastMessageSenderId())
                                .build()
                ).chat(IndividualChatEntity.builder()
                        .id(chatRoomDataModel.getChatId())
                        .ownerId(chatRoomDataModel.getOwnerId())
                        .companionId(chatRoomDataModel.getCompanionId())
                        .createdAt(chatRoomDataModel.getCreatedAt())
                        .build()
                ).build();
    }
}
