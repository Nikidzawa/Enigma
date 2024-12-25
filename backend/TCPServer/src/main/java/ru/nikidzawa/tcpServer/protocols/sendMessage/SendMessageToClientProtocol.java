package ru.nikidzawa.tcpServer.protocols.sendMessage;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SendMessageToClientProtocol {
    public static final String basePath = "ENIGMA-SEND-MESSAGE-TO-CLIENT";

    public final static int protocolSize = 3;
    public static final int senderIdProtocolPosition = 0;
    public static final int receiverIdProtocolPosition = 1;
    public static final int messageProtocolPosition = 2;

    private String senderId;
    private String message;
}
