package ru.nikidzawa.db.store.dto.service;

import org.springframework.stereotype.Component;
import ru.nikidzawa.db.store.dto.object.dto.MessageDto;
import ru.nikidzawa.db.store.entities.MessageEntity;

@Component
public class MessageDtoFactory {
    public MessageDto convert (MessageEntity messageEntity) {
        return MessageDto.builder()
                .id(messageEntity.getId())
                .text(messageEntity.getText())
                .createdAt(messageEntity.getCreatedAt())
                .senderId(messageEntity.getSenderId())
                .chatId(messageEntity.getChatId())
                .build();
    }
}