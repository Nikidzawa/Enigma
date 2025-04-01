package ru.nikidzawa.backend.controllers;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import ru.nikidzawa.backend.services.IndividualChatEntityService;
import ru.nikidzawa.backend.store.client.dto.ChatRoomDto;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("chats/")
@CrossOrigin
public class IndividualChatEntityController {

    private static final String GET_ALL_USER_CHATS = "getAllUserChats/{currentUserId}";

    IndividualChatEntityService individualChatEntityService;

    @GetMapping(GET_ALL_USER_CHATS)
    public List<ChatRoomDto> getAllUserChats(@PathVariable Long currentUserId) {
        return individualChatEntityService.getAllChatsByUserId(currentUserId);
    }
}