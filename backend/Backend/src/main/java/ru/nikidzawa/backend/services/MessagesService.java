package ru.nikidzawa.backend.services;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import ru.nikidzawa.backend.store.client.dataModel.MessageDataModel;
import ru.nikidzawa.backend.store.client.dto.MessageDto;
import ru.nikidzawa.backend.store.client.factory.MessageDtoFactory;
import ru.nikidzawa.backend.store.entity.IndividualChatEntity;
import ru.nikidzawa.backend.store.entity.MessageEntity;
import ru.nikidzawa.backend.store.repository.IndivChatMessagesRepository;
import ru.nikidzawa.backend.store.repository.IndividualChatEntityRepository;
import ru.nikidzawa.backend.store.repository.MessageEntityRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessagesService {

    MessageEntityRepository messageRepository;

    IndivChatMessagesRepository chatMessagesRepository;

    IndividualChatEntityRepository individualChatEntityRepository;

    MessageDtoFactory factory;

    public List<MessageDto> getByChatIdAndLastMessageId (Long chatId, Long lastMessageId) {
        List<MessageDataModel> messageDataModels;
        if (lastMessageId == 0) {
            messageDataModels = chatMessagesRepository.getByChatId(chatId);
        } else {
            messageDataModels = chatMessagesRepository.getByChatIdAndLastMessageId(chatId, lastMessageId);
        }
        return messageDataModels.stream()
                .map(factory::convert)
                .collect(Collectors.toList());
    }

    public List<MessageDto> getMessagesBySenderIdAndReceiverId(Long senderId, Long receiverId) {
        Optional<IndividualChatEntity> senderIndividualChat = individualChatEntityRepository
                .findByOwnerIdAndCompanionId(senderId, receiverId);
        return senderIndividualChat.map(individualChatEntity ->
                        chatMessagesRepository.getByChatId(individualChatEntity.getId()).stream()
                                .map(factory::convert)
                                .collect(Collectors.toList()))
                .orElseGet(ArrayList::new);
    }

    public MessageDto send(Long senderId, Long receiverId, MessageEntity messageEntity) {
        MessageEntity message = messageRepository.saveAndFlush(messageEntity);

        IndividualChatEntity senderIndividualChat = individualChatEntityRepository
                .findByOwnerIdAndCompanionId(senderId, receiverId)
                .orElseGet(() -> individualChatEntityRepository.saveAndFlush(
                        IndividualChatEntity.builder()
                                .createdAt(LocalDateTime.now())
                                .ownerId(senderId)
                                .companionId(receiverId)
                                .build()
                )
        );
        chatMessagesRepository.saveIndivChatMessage(senderIndividualChat.getId(), message.getId());

        IndividualChatEntity receiverIndividualChat = individualChatEntityRepository
                .findByOwnerIdAndCompanionId(receiverId, senderId)
                .orElseGet(() -> individualChatEntityRepository.saveAndFlush(
                        IndividualChatEntity.builder()
                                .createdAt(LocalDateTime.now())
                                .ownerId(receiverId)
                                .companionId(senderId)
                                .build()
                )
        );
        chatMessagesRepository.saveIndivChatMessage(receiverIndividualChat.getId(), message.getId());
        return factory.convert(message);
    }
}
