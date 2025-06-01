package ru.nikidzawa.websocketserver.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import ru.nikidzawa.websocketserver.store.message.*;
import ru.nikidzawa.websocketserver.store.typing.TypingRequest;
import ru.nikidzawa.websocketserver.store.typing.TypingResponse;

/**
 * @author Nikidzawa
 */
@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatController {

    SimpMessagingTemplate messagingTemplate;

    private static final String sendMessageDestination = "/queue/messages";
    private static final String typingDestination = "/queue/chat/private/%s/typing";
    private static final String deleteMessageDestination = "/queue/chat/private/%s/delete";
    private static final String readMessageDestination = "/queue/chat/private/%s/read";

    /**
     * @Subscription: /client/{id подписчика}/queue/messages
     * @Description: Отправка сообщения
     */
    @MessageMapping("/message/send")
    public void sendMessage(@Payload ChatMessageNewResponse chatMessageNew) {
        messagingTemplate.convertAndSendToUser(chatMessageNew.getReceiverId(),sendMessageDestination, chatMessageNew);
        messagingTemplate.convertAndSendToUser(chatMessageNew.getReceiverId(), String.format(typingDestination, chatMessageNew.getSenderId()), new TypingResponse(false));
    }

    /**
     * @Subscription: /client/{id подписчика}/queue/chat/private/{id собеседника}/read
     * @Description: Статус "Прочитано" у сообщений.
     */
    @MessageMapping("/message/read")
    public void readMessage(@Payload ChatMessageReadRequest chatMessageReadRequest) {
        messagingTemplate.convertAndSendToUser(
                chatMessageReadRequest.getSubscriberId(),
                String.format(readMessageDestination, chatMessageReadRequest.getChatId()),
                new ChatMessageReadResponse(chatMessageReadRequest.getMessageId())
        );
    }

    /**
     * @Subscription: /client/{id подписчика}/queue/chat/private/{id собеседника}/typing
     * @Description: Статус "Печатает"
     */
    @MessageMapping("/chat/private/typing")
    public void isTyping(@Payload TypingRequest typingRequest) {
        messagingTemplate.convertAndSendToUser(
                typingRequest.getTargetId(),
                String.format(typingDestination, typingRequest.getWriterId()),
                new TypingResponse(typingRequest.getIsTyping())
        );
    }

    /**
     * @Subscription: /client/{id подписчика}/queue/chat/private/{id собеседника}/delete
     * @Description: Удаление сообщения
     */
    @MessageMapping("/message/delete")
    public void deleteMessage(@Payload ChatMessageDeleteRequest deleteRequest) {
        messagingTemplate.convertAndSendToUser(
                deleteRequest.getSubscriberId(),
                String.format(deleteMessageDestination, deleteRequest.getChatId()),
                new ChatMessageDeleteResponse(deleteRequest.getMessageId())
        );
    }
}
