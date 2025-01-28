package ru.nikidzawa.db.controllers;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import ru.nikidzawa.db.services.MessagesService;
import ru.nikidzawa.db.store.client.dto.MessageDto;
import ru.nikidzawa.db.store.entity.MessageEntity;

import java.util.List;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("messages/")
public class MessagesController {

    private static final String GET_MESSAGES_BY_CHAT_ID = "getByChatId/{chatId}";
    private static final String SAVE_MESSAGE = "new/{chatId}";

    MessagesService service;

    @GetMapping(GET_MESSAGES_BY_CHAT_ID)
    public List<MessageDto> getByChatIdAndLastMessageId (@PathVariable Long chatId,
                                                         @RequestParam Long lastMessageId
    ) {
        return service.getByChatIdAndLastMessageId(chatId, lastMessageId);
    }

    @PostMapping(SAVE_MESSAGE)
    public MessageDto save(@RequestBody MessageEntity messageEntity,
                           @PathVariable Long chatId
    ) {
        return service.save(messageEntity, chatId);
    }
}
