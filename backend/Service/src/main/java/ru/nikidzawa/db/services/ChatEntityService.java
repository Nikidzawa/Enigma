package ru.nikidzawa.db.services;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import ru.nikidzawa.db.store.dto.object.data.ChatRoomData;
import ru.nikidzawa.db.store.dto.object.dto.ChatRoomDto;
import ru.nikidzawa.db.store.dto.service.ChatRoomDtoFactory;
import ru.nikidzawa.db.store.repositories.ChatRoomRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatEntityService {

    ChatRoomRepository repository;

    ChatRoomDtoFactory factory;

    public List<ChatRoomDto> getAllChatsByUserId (Long currentUserId) {
        List<ChatRoomData> chatRoomData = repository.findAllChatRoomsByUserId(currentUserId);
        return chatRoomData.stream().map(factory::convert).collect(Collectors.toList());
    }
}
