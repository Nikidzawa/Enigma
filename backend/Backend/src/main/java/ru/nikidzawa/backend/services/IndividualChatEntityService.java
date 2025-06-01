package ru.nikidzawa.backend.services;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import ru.nikidzawa.backend.exceptions.NotFoundException;
import ru.nikidzawa.backend.store.client.dataModel.ChatRoomDataModel;
import ru.nikidzawa.backend.store.client.dto.ChatDto;
import ru.nikidzawa.backend.store.client.dto.PrivateChatRoomDto;
import ru.nikidzawa.backend.store.client.factory.ChatDtoFactory;
import ru.nikidzawa.backend.store.client.factory.ChatRoomDtoFactory;
import ru.nikidzawa.backend.store.entity.ChatEntity;
import ru.nikidzawa.backend.store.entity.ChatType;
import ru.nikidzawa.backend.store.entity.PrivateChatEntity;
import ru.nikidzawa.backend.store.repository.ChatRepository;
import ru.nikidzawa.backend.store.repository.ChatRoomRepository;
import ru.nikidzawa.backend.store.repository.PrivateChatEntityRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class IndividualChatEntityService {

    ChatRoomRepository chatRoomRepository;

    PrivateChatEntityRepository privateChatRepository;

    ChatRoomDtoFactory factory;

    ChatRepository chatRepository;

    ChatDtoFactory chatDtoFactory;

    public List<PrivateChatRoomDto> getAllByOwnerId(Long ownerId) {
        List<ChatRoomDataModel> chatRoomData = chatRoomRepository.getAllByOwner(ownerId);
        return chatRoomData.stream().map(factory::convert).collect(Collectors.toList());
    }

    public ChatDto findChatOrCreate(Long ownerId, Long companionId) {
        Optional<PrivateChatEntity> optionalOwnerPrivateChat = privateChatRepository.findByOwnerIdAndCompanionId(ownerId, companionId);

        if (optionalOwnerPrivateChat.isEmpty()) {
            ChatEntity chat = chatRepository.saveAndFlush(ChatEntity
                    .builder()
                    .createdAt(LocalDateTime.now())
                    .type(ChatType.PRIVATE)
                    .build()
            );

            PrivateChatEntity ownerPrivateChat = privateChatRepository.saveAndFlush(
                    PrivateChatEntity.builder()
                            .chatId(chat.getId())
                            .ownerId(ownerId)
                            .companionId(companionId)
                            .build()
            );

            privateChatRepository.saveAndFlush(
                    PrivateChatEntity.builder()
                            .chatId(chat.getId())
                            .ownerId(companionId)
                            .companionId(ownerId)
                            .build()
            );

            return chatDtoFactory.convert(chat, ownerPrivateChat);
        } else {
            ChatEntity chat = chatRepository.findById(optionalOwnerPrivateChat.get().getChatId())
                    .orElseThrow(() -> new NotFoundException("Chat not found"));
            return chatDtoFactory.convert(chat, optionalOwnerPrivateChat.get());
        }
    }
}
