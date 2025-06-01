package ru.nikidzawa.backend.store.client.factory;

import org.springframework.stereotype.Component;
import ru.nikidzawa.backend.store.client.dataModel.ChatRoomDataModel;
import ru.nikidzawa.backend.store.client.dto.ChatDto;
import ru.nikidzawa.backend.store.entity.ChatEntity;
import ru.nikidzawa.backend.store.entity.PrivateChatEntity;

@Component
public class ChatDtoFactory {
    public ChatDto convert(ChatEntity c, PrivateChatEntity p) {
        return ChatDto.builder()
                .chatId(c.getId())
                .chatType(c.getType().name())
                .ownerId(p.getOwnerId())
                .companionId(p.getCompanionId())
                .build();
    }

    public ChatDto convertFromDataModel(ChatRoomDataModel m) {
        return ChatDto.builder()
                .chatId(m.getChatId())
                .chatType(m.getChatType())
                .ownerId(m.getOwnerId())
                .companionId(m.getIndividualId())
                .build();
    }
}
