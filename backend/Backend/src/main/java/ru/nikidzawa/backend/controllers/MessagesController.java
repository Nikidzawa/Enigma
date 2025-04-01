package ru.nikidzawa.backend.controllers;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import ru.nikidzawa.backend.services.MessagesService;
import ru.nikidzawa.backend.store.client.dto.MessageDto;
import ru.nikidzawa.backend.store.entity.MessageEntity;

import java.util.List;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("messages/")
public class MessagesController {

    private static final String GET_MESSAGES_BY_CHAT_ID = "getByChatId/{chatId}";
    private static final String GET_MESSAGES_BY_SENDER_ID_AND_RECEIVER_ID = "get";
    private static final String SEND_MESSAGE = "send";

    MessagesService service;

    @GetMapping(GET_MESSAGES_BY_CHAT_ID)
    public List<MessageDto> getByChatIdAndLastMessageId (@PathVariable Long chatId,
                                                         @RequestParam Long lastMessageId
    ) {
        return service.getByChatIdAndLastMessageId(chatId, lastMessageId);
    }

    @PostMapping(SEND_MESSAGE)
    public MessageDto send(
            @RequestParam Long senderId,
            @RequestParam Long receiverId,
            @RequestBody MessageEntity messageEntity
    ) {
        return service.send(senderId, receiverId, messageEntity);
    }

    @GetMapping(GET_MESSAGES_BY_SENDER_ID_AND_RECEIVER_ID)
    public List<MessageDto> getMessagesBySenderIdAndReceiverId (@RequestParam Long senderId,
                                                                @RequestParam Long receiverId) {
        return service.getMessagesBySenderIdAndReceiverId(senderId, receiverId);
    }
}
