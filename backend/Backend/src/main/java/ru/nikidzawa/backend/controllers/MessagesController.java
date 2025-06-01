package ru.nikidzawa.backend.controllers;

import jakarta.transaction.Transactional;
import jakarta.websocket.server.PathParam;
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

    private static final String GET_MESSAGES_BY_CHAT_ID_AND_LAST_MESSAGE_ID = "/chatId/{chatId}/lastMessageId/{lastMessageId}";
    private static final String GET_MESSAGES_BY_CHAT_ID = "/chatId/{chatId}";
    private static final String SAVE_MESSAGE = "/save";
    private static final String READ_MESSAGE = "/read/{messageId}";
    private static final String EDIT_MESSAGE = "/edit/{messageId}";
    private static final String DELETE_MESSAGE = "/delete/{messageId}";

    MessagesService service;

    MessageDtoFactory factory;

    @GetMapping(GET_MESSAGES_BY_CHAT_ID_AND_LAST_MESSAGE_ID)
    public List<MessageDto> getByChatIdAndLastMessageId (@PathVariable Long chatId,
                                                         @PathVariable Long lastMessageId) {
        List<MessageEntity> messageEntities = service.getByChatIdAndLastMessageId(chatId, lastMessageId);
        return messageEntities.stream()
                .map(factory::convert)
                .toList();
    }

    @GetMapping(GET_MESSAGES_BY_CHAT_ID)
    public List<MessageDto> getByChatId (@PathVariable Long chatId) {
        List<MessageEntity> messageEntities = service.getByChatId(chatId);
        return messageEntities.stream()
                .map(factory::convert)
                .toList();
    }

    @PostMapping(SAVE_MESSAGE)
    public MessageDto save(@RequestBody MessageEntity messageEntity) {
        return factory.convert(service.save(messageEntity));
    }

    @PutMapping(READ_MESSAGE)
    public void read(@PathVariable Long messageId) {
        service.read(messageId);
    }

    @PutMapping(EDIT_MESSAGE)
    public void edit(@PathVariable Long messageId, @RequestParam String text) {
        service.edit(messageId, text);
    }

    @DeleteMapping(DELETE_MESSAGE)
    public boolean delete(@PathVariable Long messageId) {
        return service.delete(messageId);
    }
}
