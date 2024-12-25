package ru.nikidzawa.tcpServer.protocols;


import ru.nikidzawa.tcpServer.protocols.sendMessage.SendMessageToClientProtocol;

/**
 * Генерирует протоколы для отправки клиенту
 */
public class ServerProtocolService {

    /**
     * ENIGMA-SEND-MESSAGE-TO-CLIENT@{senderId}:{messageText}
     */
    public String collectSendMessageToClientProtocol(String senderId, String message) {
        return SendMessageToClientProtocol.basePath + Separators.BASE_PATH.getName() + senderId + Separators.SUB_PATH.getName() + message;
    }

}
