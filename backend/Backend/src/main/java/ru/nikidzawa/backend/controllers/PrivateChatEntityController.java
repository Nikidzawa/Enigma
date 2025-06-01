package ru.nikidzawa.backend.controllers;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import ru.nikidzawa.backend.services.IndividualChatEntityService;
import ru.nikidzawa.backend.store.client.dto.ChatDto;
import ru.nikidzawa.backend.store.client.dto.PrivateChatRoomDto;
import ru.nikidzawa.backend.store.entity.ChatEntity;
import ru.nikidzawa.backend.store.entity.PrivateChatEntity;

import java.util.List;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/chats")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PrivateChatEntityController {

    private static final String GET_ALL_BY_OWNER_ID = "/{ownerId}/all";
    private static final String FIND_OR_CREATE_CHAT = "/findOrCreateChat";

    IndividualChatEntityService individualChatEntityService;

    @GetMapping(GET_ALL_BY_OWNER_ID)
    public List<PrivateChatRoomDto> getAllByOwnerId(@PathVariable Long ownerId) {
        return individualChatEntityService.getAllByOwnerId(ownerId);
    }

    @GetMapping(FIND_OR_CREATE_CHAT)
    public ChatDto findOrCreateChat(@RequestParam Long ownerId, @RequestParam Long companionId) {
        return individualChatEntityService.findChatOrCreate(ownerId, companionId);
    }
}