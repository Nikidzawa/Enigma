package ru.nikidzawa.backend.store.client.factory;

import org.springframework.stereotype.Component;
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
}