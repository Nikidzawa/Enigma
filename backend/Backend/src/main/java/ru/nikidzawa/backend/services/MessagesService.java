package ru.nikidzawa.backend.services;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import ru.nikidzawa.backend.exceptions.NotFoundException;
import ru.nikidzawa.backend.store.entity.MessageEntity;
import ru.nikidzawa.backend.store.entity.PrivateChatDeletedMessagesEntity;
import ru.nikidzawa.backend.store.repository.MessageEntityRepository;
import ru.nikidzawa.backend.store.repository.PrivateChatDeletedMessagesRepository;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessagesService {

    MessageEntityRepository messageRepository;

    PrivateChatDeletedMessagesRepository deletedMessagesRepository;

    public List<MessageEntity> getByChatIdAndLastMessageId (Long chatId, Long lastMessageId) {
        List<MessageEntity> messageEntities;
        if (lastMessageId == 0) {
            messageEntities = messageRepository.getByChatId(chatId);
        } else {
            messageEntities = messageRepository.getByChatIdAndLastMessageId(chatId, lastMessageId);
        }
        return messageEntities;
    }

    public MessageEntity save(MessageEntity messageEntity) {
        return messageRepository.saveAndFlush(messageEntity);
    }

    public void read (Long messageId) {
        MessageEntity message = messageRepository.findById(messageId)
                .orElseThrow(() -> new NotFoundException("Сообщение не найдено"));
        message.setIsRead(true);
        messageRepository.saveAndFlush(message);
    }

    public boolean deleteFromPrivateChat(Long messageId, Long userId) {
        Optional<PrivateChatDeletedMessagesEntity> deletedMessageEntity = deletedMessagesRepository.findById(messageId);
        if (deletedMessageEntity.isPresent()) {
            deletedMessagesRepository.deleteById(messageId);
            messageRepository.deleteById(messageId);
        } else {
            deletedMessagesRepository.saveAndFlush(PrivateChatDeletedMessagesEntity.builder()
                    .messageId(messageId)
                    .userId(userId)
                    .build());
        }
        return true;
    }

    public void deleteMessage (Long messageId) {
        messageRepository.deleteById(messageId);
    }
}
