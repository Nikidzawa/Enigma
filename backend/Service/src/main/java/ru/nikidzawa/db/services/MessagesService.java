package ru.nikidzawa.db.services;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import ru.nikidzawa.db.store.client.dataModel.MessageDataModel;
import ru.nikidzawa.db.store.client.dto.MessageDto;
import ru.nikidzawa.db.store.client.factory.MessageDtoFactory;
import ru.nikidzawa.db.store.entity.IndividualChatEntity;
import ru.nikidzawa.db.store.entity.MessageEntity;
import ru.nikidzawa.db.store.repository.IndivChatMessagesRepository;
import ru.nikidzawa.db.store.repository.IndividualChatEntityRepository;
import ru.nikidzawa.db.store.repository.MessageEntityRepository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional
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
