package ru.kirkazan.rmis.app.websocketserver.store;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Authentication {
    private Long userId;
    private String token;
}
