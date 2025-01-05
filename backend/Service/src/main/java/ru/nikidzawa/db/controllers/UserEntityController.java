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

    private static final String GET_USER_BY_ID = "{userId}";
    private static final String USER_AUTHENTICATION = "login";

    UserEntityService userEntityService;

    @GetMapping(GET_USER_BY_ID)
    public IndividualEntity getUserById(@PathVariable Long userId) {
        return userEntityService.getUserById(userId);
    }

    @GetMapping(USER_AUTHENTICATION)
    public IndividualEntity userAuthenticate(@RequestParam String username,
                                             @RequestParam String password) {
        return userEntityService.authenticate(username, password);
    }
}