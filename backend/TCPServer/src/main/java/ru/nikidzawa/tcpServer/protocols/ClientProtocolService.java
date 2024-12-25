package ru.nikidzawa.tcpServer.protocols;

import ru.nikidzawa.tcpServer.protocols.auth.AuthToServerProtocol;
import ru.nikidzawa.tcpServer.protocols.sendMessage.SendMessageToServerProtocol;

/**
 * Генерирует протоколы для отправки серверу
 */
public class ClientProtocolService {

    /**
     * ENIGMA-AUTH-TO-SERVER@{USER_ID}
     */
    public String collectAuthToServerProtocol(String userId) {
        return AuthToServerProtocol.basePath + Separators.BASE_PATH + userId;
    }

    /**
     *     ENIGMA-SEND-MESSAGE-TO-SERVER@{senderId}:{receiverId}:{messageText}
     */
    public String collectSendMessageToServerProtocol(String receiverId, String senderId, String message) {
        return SendMessageToServerProtocol.basePath + Separators.BASE_PATH.getName() + receiverId + Separators.SUB_PATH.getName() + senderId + Separators.SUB_PATH.getName() + message;
    }
}
