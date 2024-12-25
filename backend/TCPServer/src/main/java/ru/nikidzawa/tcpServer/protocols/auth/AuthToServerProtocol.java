package ru.nikidzawa.tcpServer.protocols.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthToServerProtocol {
    public static final String basePath = "ENIGMA-AUTH-TO-SERVER";
    public static final String basePathSeparator = "@";

    public final static int protocolSize = 1;

    public static final int userIdProtocolPosition = 0;
    private String userId;
}
