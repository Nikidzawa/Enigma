package ru.nikidzawa.backend.store.client.factory;

import org.springframework.stereotype.Component;
import ru.nikidzawa.backend.store.client.dataModel.ChatRoomDataModel;
import ru.nikidzawa.backend.store.client.dto.MessageDto;
import ru.nikidzawa.backend.store.entity.MessageEntity;

@Component
public class MessageDtoFactory {
    public MessageDto convert (MessageEntity messageEntity) {
        return MessageDto.builder()
                .id(messageEntity.getId())
                .senderId(messageEntity.getSenderId())
                .chatId(messageEntity.getChatId())
                .sentAt(messageEntity.getSentAt())
                .text(messageEntity.getText())
                .isPinned(messageEntity.getIsPinned())
                .isEdited(messageEntity.getIsEdited())
                .editedAt(messageEntity.getEditedAt())
                .isRead(messageEntity.getIsRead())
                .build();
    }

    public MessageDto convertFromDataModel (ChatRoomDataModel m) {
        return MessageDto.builder()
                .id(m.getLastMessageId())
                .senderId(m.getSenderId())
                .sentAt(m.getSentAt())
                .text(m.getText())
                .isPinned(m.getIsPinned())
                .isEdited(m.getIsEdited())
                .editedAt(m.getEditedAt())
                .isRead(m.getIsRead())
                .build();
    }
}