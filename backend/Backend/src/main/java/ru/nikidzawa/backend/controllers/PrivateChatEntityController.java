package ru.nikidzawa.backend.controllers;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import ru.nikidzawa.backend.services.IndividualChatEntityService;
import ru.nikidzawa.backend.store.client.dto.PrivateChatRoomDto;

import java.util.List;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/chats")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PrivateChatEntityController {

    private static final String GET_ALL_BY_OWNER_ID = "/{ownerId}/all";

    IndividualChatEntityService individualChatEntityService;

    @GetMapping(GET_ALL_BY_OWNER_ID)
    public List<PrivateChatRoomDto> getAllByOwnerId(@PathVariable Long ownerId) {
        return individualChatEntityService.getAllByOwnerId(ownerId);
    }
}