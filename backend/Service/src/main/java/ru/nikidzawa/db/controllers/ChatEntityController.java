package ru.nikidzawa.db.controllers;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import ru.nikidzawa.db.services.ChatEntityService;
import ru.nikidzawa.db.store.dto.object.dto.ChatRoomDto;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("chats/")
@CrossOrigin
public class ChatEntityController {

    private static final String GET_ALL_USER_CHATS = "getAllUserChats/{currentUserId}";

    ChatEntityService chatEntityService;

    @GetMapping(GET_ALL_USER_CHATS)
    public List<ChatRoomDto> getAllUserChats(@PathVariable Long currentUserId) {
        return chatEntityService.getAllChatsByUserId(currentUserId);
    }
}
