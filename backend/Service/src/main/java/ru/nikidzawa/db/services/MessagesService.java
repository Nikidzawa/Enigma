package ru.nikidzawa.db.services;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import ru.nikidzawa.db.store.client.dataModel.MessageDataModel;
import ru.nikidzawa.db.store.client.dto.MessageDto;
import ru.nikidzawa.db.store.client.factory.MessageDtoFactory;
import ru.nikidzawa.db.store.entity.MessageEntity;
import ru.nikidzawa.db.store.repository.IndivChatMessagesRepository;
import ru.nikidzawa.db.store.repository.MessageEntityRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional
public class MessagesService {

    MessageEntityRepository messageRepository;

    IndivChatMessagesRepository chatMessagesRepository;

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

    public MessageDto save (MessageEntity messageEntity, Long chatId) {
        MessageEntity message = messageRepository.saveAndFlush(messageEntity);
        chatMessagesRepository.saveIndivChatMessage(chatId, message.getId());
        return factory.convert(message);
    }
}
