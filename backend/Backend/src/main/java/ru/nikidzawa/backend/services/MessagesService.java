package ru.nikidzawa.backend.services;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import ru.nikidzawa.backend.exceptions.NotFoundException;
import ru.nikidzawa.backend.store.client.dataModel.MessageDataModel;
import ru.nikidzawa.backend.store.client.dto.MessageDto;
import ru.nikidzawa.backend.store.client.factory.MessageDtoFactory;
import ru.nikidzawa.backend.store.entity.ChatEntity;
import ru.nikidzawa.backend.store.entity.PrivateChatEntity;
import ru.nikidzawa.backend.store.entity.MessageEntity;
import ru.nikidzawa.backend.store.repository.ChatRepository;
import ru.nikidzawa.backend.store.repository.IndivChatMessagesRepository;
import ru.nikidzawa.backend.store.repository.PrivateChatEntityRepository;
import ru.nikidzawa.backend.store.repository.MessageEntityRepository;

import java.time.LocalDateTime;
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

    PrivateChatEntityRepository privateChatEntityRepository;

    ChatRepository chatRepository;

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
        Optional<PrivateChatEntity> senderIndividualChat = privateChatEntityRepository
                .findByOwnerIdAndCompanionId(senderId, receiverId);
        return null;
    }

    public MessageDto save(Long receiverId, MessageEntity messageEntity) {
        if (messageEntity.getChatId() == null) {
            Long senderId = messageEntity.getSenderId();
            PrivateChatEntity privateChat = privateChatEntityRepository
                    .findByOwnerIdAndCompanionId(senderId, receiverId)
                    .orElse(null);

            if (privateChat == null) {
                ChatEntity chat = chatRepository.saveAndFlush(ChatEntity
                        .builder()
                        .createdAt(LocalDateTime.now())
                        .build()
                );

                messageEntity.setChatId(chat.getId());

                new Thread(() -> {
                    privateChatEntityRepository.saveAndFlush(
                            PrivateChatEntity.builder()
                                    .chatId(chat.getId())
                                    .ownerId(senderId)
                                    .companionId(receiverId)
                                    .build()
                    );
                    privateChatEntityRepository.saveAndFlush(
                            PrivateChatEntity.builder()
                                    .chatId(chat.getId())
                                    .ownerId(receiverId)
                                    .companionId(senderId)
                                    .build()
                    );
                }).start();
            } else {
                messageEntity.setChatId(privateChat.getChatId());
            }
        }

        MessageEntity message = messageRepository.saveAndFlush(messageEntity);

        return factory.convert(message);
    }

    public void read (Long messageId) {
        MessageEntity message = messageRepository.findById(messageId)
                .orElseThrow(() -> new NotFoundException("Сообщение не найдено"));
        message.setIsRead(true);
        messageRepository.saveAndFlush(message);
    }
}
