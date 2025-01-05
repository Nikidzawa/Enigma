package ru.nikidzawa.db.services;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import ru.nikidzawa.db.store.client.dataModel.ChatRoomDataModel;
import ru.nikidzawa.db.store.client.dto.ChatRoomDto;
import ru.nikidzawa.db.store.client.factory.ChatRoomDtoFactory;
import ru.nikidzawa.db.store.repository.ChatRoomRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatEntityService {

    ChatRoomRepository repository;

    ChatRoomDtoFactory factory;

    public List<ChatRoomDto> getAllChatsByUserId (Long currentUserId) {
        List<ChatRoomDataModel> chatRoomData = repository.findAllChatRoomsByUserId(currentUserId);
        return chatRoomData.stream().map(factory::convert).collect(Collectors.toList());
    }
}
