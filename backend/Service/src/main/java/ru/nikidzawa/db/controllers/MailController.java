package ru.nikidzawa.db.controllers;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import ru.nikidzawa.db.services.MailService;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("mail/")
public class MailController {

    MailService service;

    private static final String SEND_AUTH_CODE = "sendAuthCode/{mail}";

    @PostMapping(SEND_AUTH_CODE)
    public String sendAuthCode(@PathVariable String mail) {
        return service.sendMessage(mail);
    }
}
