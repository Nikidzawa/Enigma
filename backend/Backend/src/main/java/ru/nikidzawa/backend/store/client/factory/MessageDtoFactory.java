package ru.nikidzawa.backend.store.client.factory;

import org.springframework.stereotype.Component;
import ru.nikidzawa.backend.store.client.dataModel.MessageDataModel;
import ru.nikidzawa.backend.store.client.dto.MessageDto;
import ru.nikidzawa.backend.store.entity.MessageEntity;

@Component
public class MessageDtoFactory {
    public MessageDto convert (MessageEntity messageEntity) {
        return MessageDto.builder()
                .id(messageEntity.getId())
                .text(messageEntity.getText())
                .createdAt(messageEntity.getCreatedAt())
                .senderId(messageEntity.getSenderId())
                .isRead(messageEntity.getIsRead())
                .build();
    }

    public MessageDto convert (MessageDataModel messageDataModel) {
        return MessageDto.builder()
                .id(messageDataModel.getId())
                .senderId(messageDataModel.getSenderId())
                .createdAt(messageDataModel.getCreatedAt())
                .text(messageDataModel.getText())
                .isRead(messageDataModel.getIsRead())
                .build();
    }
}