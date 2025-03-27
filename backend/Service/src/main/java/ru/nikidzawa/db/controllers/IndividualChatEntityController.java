package ru.nikidzawa.db.controllers;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import ru.nikidzawa.db.services.IndividualChatEntityService;
import ru.nikidzawa.db.store.client.dto.ChatRoomDto;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("chats/")
@CrossOrigin
public class IndividualChatEntityController {

    private static final String GET_ALL_USER_CHATS = "getAllUserChats/{currentUserId}";
    private static final String GET_OR_CREATE = "getOrCreate";

    IndividualChatEntityService individualChatEntityService;

    @GetMapping(GET_ALL_USER_CHATS)
    public List<ChatRoomDto> getAllUserChats(@PathVariable Long currentUserId) {
        return individualChatEntityService.getAllChatsByUserId(currentUserId);
    }

    @PostMapping(GET_OR_CREATE)
    public ChatRoomDto getOrCreate(@RequestParam Long ownerId, @RequestParam Long companionId) {
        return individualChatEntityService.getOrCreate(ownerId, companionId);
    }
}