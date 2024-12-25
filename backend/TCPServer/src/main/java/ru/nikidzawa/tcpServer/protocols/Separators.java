package ru.nikidzawa.tcpServer.protocols;

import lombok.Getter;

@Getter
public enum Separators {
    BASE_PATH("@"),
    SUB_PATH(":");

    private final String name;

    Separators(String name) {
        this.name = name;
    }
}
