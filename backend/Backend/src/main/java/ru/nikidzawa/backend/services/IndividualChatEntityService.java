package ru.nikidzawa.backend.services;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import ru.nikidzawa.backend.store.client.dataModel.ChatRoomDataModel;
import ru.nikidzawa.backend.store.client.dto.PrivateChatRoomDto;
import ru.nikidzawa.backend.store.client.factory.ChatRoomDtoFactory;
import ru.nikidzawa.backend.store.repository.ChatRoomRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class IndividualChatEntityService {

    ChatRoomRepository chatRoomRepository;

    ChatRoomDtoFactory factory;

    public List<PrivateChatRoomDto> getAllByOwnerId(Long ownerId) {
        List<ChatRoomDataModel> chatRoomData = chatRoomRepository.getAllByOwner(ownerId);
        return chatRoomData.stream().map(factory::convert).collect(Collectors.toList());
    }
}
