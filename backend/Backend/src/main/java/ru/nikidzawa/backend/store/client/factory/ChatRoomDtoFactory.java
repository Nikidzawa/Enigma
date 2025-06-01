package ru.nikidzawa.backend.store.client.factory;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;
import ru.nikidzawa.backend.store.client.dataModel.ChatRoomDataModel;
import ru.nikidzawa.backend.store.client.dto.PrivateChatRoomDto;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatRoomDtoFactory {

    ChatDtoFactory chatDtoFactory;

    IndividualDtoFactory individualDtoFactory;

    MessageDtoFactory messageDtoFactory;

    public PrivateChatRoomDto convert (ChatRoomDataModel model) {
        return PrivateChatRoomDto.builder()
                .companion(individualDtoFactory.convertFromDataModel(model))
                .lastMessage(messageDtoFactory.convertFromDataModel(model))
                .chat(chatDtoFactory.convertFromDataModel(model))
                .unreadCount(model.getUnreadCount())
                .build();
    }
}
