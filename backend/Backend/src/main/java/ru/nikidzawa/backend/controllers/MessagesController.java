package ru.nikidzawa.backend.controllers;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import ru.nikidzawa.backend.exceptions.NotFoundException;
import ru.nikidzawa.backend.services.MessagesService;
import ru.nikidzawa.backend.store.client.dto.MessageDto;
import ru.nikidzawa.backend.store.client.factory.MessageDtoFactory;
import ru.nikidzawa.backend.store.entity.ChatEntity;
import ru.nikidzawa.backend.store.entity.MessageEntity;
import ru.nikidzawa.backend.store.repository.ChatRepository;

import java.util.List;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/messages")
public class MessagesController {

    private static final String GET_MESSAGES_BY_CHAT_ID = "/getByChatId/{chatId}";
    private static final String SAVE_MESSAGE = "/save";
    private static final String READ_MESSAGE = "/read/{messageId}";

    MessagesService service;

    ChatRepository chatRepository;

    MessageDtoFactory factory;

    @GetMapping(GET_MESSAGES_BY_CHAT_ID)
    public List<MessageDto> getByChatIdAndLastMessageId (@PathVariable Long chatId,
                                                         @RequestParam Long lastMessageId) {
        List<MessageEntity> messageEntities = service.getByChatIdAndLastMessageId(chatId, lastMessageId);
        return messageEntities.stream()
                .map(factory::convert)
                .toList();
    }

    @PostMapping(SAVE_MESSAGE)
    public MessageDto save(@RequestBody MessageEntity messageEntity) {
        MessageEntity savedMessage = service.save(messageEntity);
        chatRepository.findById(savedMessage.getChatId()).ifPresent(chat -> {
            chat.setLastMessageId(savedMessage.getId());
            chatRepository.saveAndFlush(chat);
        });
        return factory.convert(savedMessage);
    }

    @PutMapping(READ_MESSAGE)
    public void read(@PathVariable Long messageId) {
        service.read(messageId);
    }
}
