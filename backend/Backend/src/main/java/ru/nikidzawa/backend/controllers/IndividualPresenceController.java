package ru.nikidzawa.backend.controllers;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import ru.nikidzawa.backend.services.IndividualPresenceService;
import ru.nikidzawa.backend.store.client.dto.PresenceDto;
import ru.nikidzawa.backend.store.client.factory.PresenceDtoFactory;

/**
 * @author Nikidzawa
 */
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("presence/")
@CrossOrigin
public class IndividualPresenceController {

    private static final String GET_ACTUAL_PRESENCE = "actual";

    IndividualPresenceService service;

    PresenceDtoFactory factory;

    @GetMapping(GET_ACTUAL_PRESENCE)
    public PresenceDto userAuthenticate(@RequestParam Long userId) {
        return factory.convert(service.getActual(userId));
    }
}
