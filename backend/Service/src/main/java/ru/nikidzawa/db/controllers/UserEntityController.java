package ru.nikidzawa.db.controllers;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import ru.nikidzawa.db.services.UserEntityService;
import ru.nikidzawa.db.store.entity.IndividualEntity;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("users/")
@CrossOrigin
public class UserEntityController {

    private static final String SAVE = "save";
    private static final String GET_USER_BY_ID = "{userId}";
    private static final String USER_AUTHENTICATION = "login";

    UserEntityService service;

    @GetMapping(GET_USER_BY_ID)
    public IndividualEntity getUserById(@PathVariable Long userId) {
        return service.getUserById(userId);
    }

    @GetMapping(USER_AUTHENTICATION)
    public IndividualEntity userAuthenticate(@RequestParam String username,
                                             @RequestParam String password) {
        return service.authenticate(username, password);
    }

    @PostMapping(SAVE)
    public IndividualEntity save(@RequestBody IndividualEntity individualEntity) {
        return service.saveUser(individualEntity);
    }
}