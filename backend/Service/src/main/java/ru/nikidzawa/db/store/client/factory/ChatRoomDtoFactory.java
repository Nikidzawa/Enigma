package ru.nikidzawa.db.store.client.factory;

import org.springframework.stereotype.Component;
import ru.nikidzawa.db.store.client.dataModel.ChatRoomDataModel;
import ru.nikidzawa.db.store.client.dto.ChatRoomDto;
import ru.nikidzawa.db.store.client.dto.MessageDto;

@Component
public class ChatRoomDtoFactory {
    public ChatRoomDto convert (ChatRoomDataModel chatRoomDataModel) {
        return ChatRoomDto.builder()
                .userId(chatRoomDataModel.getUserId())
                .userName(chatRoomDataModel.getUserName())
                .userSurname(chatRoomDataModel.getUserSurname())
                .lastMessage(chatRoomDataModel.getLastMessageId() == 0 ? null :
                        MessageDto.builder()
                                .id(chatRoomDataModel.getLastMessageId())
                                .createdAt(chatRoomDataModel.getLastMessageSendTime())
                                .text(chatRoomDataModel.getLastMessageText())
                                .senderId(chatRoomDataModel.getLastMessageSenderId())
                                .build()
                )
                .chatId(chatRoomDataModel.getChatId())
                .build();
    }
}
