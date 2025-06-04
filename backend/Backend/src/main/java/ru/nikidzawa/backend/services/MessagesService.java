package ru.nikidzawa.backend.services;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import ru.nikidzawa.backend.exceptions.NotFoundException;
import ru.nikidzawa.backend.store.entity.MessageEntity;
import ru.nikidzawa.backend.store.repository.MessageEntityRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessagesService {

    MessageEntityRepository messageRepository;

    public List<MessageEntity> getByChatIdAndLastMessageId (Long chatId, Long lastMessageId) {
        return messageRepository.getByChatIdAndLastMessageId(chatId, lastMessageId);
    }

    public List<MessageEntity> getByChatId (Long chatId) {
        return messageRepository.getByChatId(chatId);
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

    public MessageEntity edit (Long messageId, String text) {
        MessageEntity message = messageRepository.findById(messageId)
                .orElseThrow(() -> new NotFoundException("Cообщение не найдено"));
        message.setText(text);
        message.setIsEdited(true);
        message.setEditedAt(LocalDateTime.now());
        return messageRepository.saveAndFlush(message);
    }

    public boolean delete (Long messageId) {
        messageRepository.deleteById(messageId);
        return true;
    }
}
