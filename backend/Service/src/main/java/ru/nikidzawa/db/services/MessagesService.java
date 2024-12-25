package ru.nikidzawa.db.services;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import ru.nikidzawa.db.store.dto.object.dto.MessageDto;
import ru.nikidzawa.db.store.dto.service.MessageDtoFactory;
import ru.nikidzawa.db.store.entities.MessageEntity;
import ru.nikidzawa.db.store.repositories.MessageEntityRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessagesService {

    MessageEntityRepository repository;

    MessageDtoFactory factory;

    public List<MessageDto> getByChatId (Long chatId, Long lastMessageId) {
        List<MessageEntity> messageEntities;
        if (lastMessageId == 0) {
            messageEntities = repository.findTop20ByChatIdOrderByIdDesc(chatId);
        } else {
            messageEntities = repository.findTop20ByChatIdAndIdLessThanOrderByIdDesc(chatId, lastMessageId);
        }
        return messageEntities.stream()
                .map(factory::convert)
                .collect(Collectors.toList());
    }
}
