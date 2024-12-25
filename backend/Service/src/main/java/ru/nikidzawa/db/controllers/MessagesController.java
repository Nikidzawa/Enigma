package ru.nikidzawa.db.controllers;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import ru.nikidzawa.db.services.MessagesService;
import ru.nikidzawa.db.store.dto.object.dto.MessageDto;
import ru.nikidzawa.db.store.entities.MessageEntity;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("messages/")
@CrossOrigin
public class MessagesController {
    private static final String GET_MESSAGES_BY_CHAT_ID = "getByChatId/{chatId}";
    private static final String SAVE_MESSAGE = "new";

    MessagesService service;

    @GetMapping(GET_MESSAGES_BY_CHAT_ID)
    public List<MessageDto> getByChatId (@PathVariable Long chatId,
                                         @RequestParam Long lastMessageId
    ) {
        return service.getByChatId(chatId, lastMessageId);
    }

    @PostMapping(SAVE_MESSAGE)
    public MessageDto save(@RequestBody MessageEntity messageEntity) {
        return service.save(messageEntity);
    }
}
