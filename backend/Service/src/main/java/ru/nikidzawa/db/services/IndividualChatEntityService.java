package ru.nikidzawa.db.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.nikidzawa.db.store.client.dataModel.ChatRoomDataModel;
import ru.nikidzawa.db.store.client.dto.ChatRoomDto;
import ru.nikidzawa.db.store.client.dto.IndividualDtoShort;
import ru.nikidzawa.db.store.client.factory.ChatRoomDtoFactory;
import ru.nikidzawa.db.store.client.factory.IndividualDtoShortFactory;
import ru.nikidzawa.db.store.entity.IndividualChatEntity;
import ru.nikidzawa.db.store.entity.IndividualEntity;
import ru.nikidzawa.db.store.repository.ChatRoomRepository;
import ru.nikidzawa.db.store.repository.IndividualChatEntityRepository;
import ru.nikidzawa.db.store.repository.IndividualEntityRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class IndividualChatEntityService {

    ChatRoomRepository chatRoomRepository;

    ChatRoomDtoFactory factory;

    IndividualChatEntityRepository individualChatEntityRepository;

    IndividualEntityRepository individualEntityRepository;

    public List<ChatRoomDto> getAllChatsByUserId (Long currentUserId) {
        List<ChatRoomDataModel> chatRoomData = chatRoomRepository.findAllChatRoomsByUserId(currentUserId);
        return chatRoomData.stream().map(factory::convert).collect(Collectors.toList());
    }

    public ChatRoomDto getOrCreate(Long ownerId, Long companionId) {
        Optional<IndividualChatEntity> optionalIndividualChat = individualChatEntityRepository.findByOwnerIdAndCompanionId(ownerId, companionId);
        IndividualChatEntity individualChat = optionalIndividualChat.orElseGet(() -> individualChatEntityRepository.saveAndFlush(
                IndividualChatEntity.builder()
                        .ownerId(ownerId)
                        .companionId(companionId)
                        .createdAt(LocalDateTime.now())
                        .build()
        ));
        IndividualEntity companion = individualEntityRepository.findById(companionId).orElseThrow(EntityNotFoundException::new);
        return ChatRoomDto.builder()
                .chat(individualChat)
                .companion(IndividualDtoShortFactory.convert(companion))
                .messages(new ArrayList<>())
                .build();
    }
}
