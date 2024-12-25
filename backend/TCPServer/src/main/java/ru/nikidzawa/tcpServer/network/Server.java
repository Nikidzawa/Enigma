package ru.nikidzawa.tcpServer.network;


import lombok.SneakyThrows;
import ru.nikidzawa.ConsoleTextHelper;
import ru.nikidzawa.tcpServer.protocols.Separators;
import ru.nikidzawa.tcpServer.protocols.ServerProtocolService;
import ru.nikidzawa.tcpServer.protocols.auth.AuthToServerProtocol;
import ru.nikidzawa.tcpServer.protocols.sendMessage.SendMessageToServerProtocol;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.util.HashMap;
import java.util.Iterator;

/**
 * Главный класс для модуля Enigma Server, здесь принимаются входящие клиентские соединения и читаются полученные от них сообщения
 */
public class Server implements ServerListener {

    /**
     * Здесь хранятся все активные соединения, ключ - id пользователя
     */
    private final HashMap<Integer, SocketChannel> connections = new HashMap<>();

    /**
     * Генерирует протоколы для отправки клиенту
     */
    private final ServerProtocolService protocolService = new ServerProtocolService();

    /**
     * Поднимаем сервер и запускаем бесконечный цикл по приёму входящих соединений.
     * <p>
     * Далее, в зависимости от события, запускаем соответствующие действия
     */
    public Server(String host, int port) throws Exception {
        Selector selector = Selector.open();
        try (ServerSocketChannel serverChannel = ServerSocketChannel.open()) {
            try {
                serverChannel.bind(new InetSocketAddress(host, port));
            } catch (IOException ex) {
                System.out.println(ConsoleTextHelper.COLOR_RED + ConsoleTextHelper.TCP_PREFIX + "Не удалось запустить сервер на порту " + port);
                throw new RuntimeException(ex);
            }
            serverChannel.configureBlocking(false);
            serverChannel.register(selector, SelectionKey.OP_ACCEPT);
            System.out.println(ConsoleTextHelper.COLOR_GREEN + ConsoleTextHelper.TCP_PREFIX + "[✔] TCP Сервер запущен на порту " + port);

            while (true) {
                selector.select();
                Iterator<SelectionKey> keyIterator = selector.selectedKeys().iterator();

                while (keyIterator.hasNext()) {
                    SelectionKey key = keyIterator.next();
                    keyIterator.remove();

                    if (key.isAcceptable()) {
                        onConnectionReady(key, selector);
                    } else if (key.isReadable()) {
                        onReceiveMessage(key);
                    }
                }
            }
        } catch (Exception e) {
            System.out.println(ConsoleTextHelper.COLOR_RED + "Произошла ошибка в работе сервера");
            throw new RuntimeException(e);
        }
    }

    /**
     * Обработчик, если событие - это запрос на соединение
     */
    @Override
    @SneakyThrows
    public void onConnectionReady(SelectionKey key, Selector selector) {
        ServerSocketChannel serverChannel = (ServerSocketChannel) key.channel();
        SocketChannel clientChannel = serverChannel.accept();
        clientChannel.configureBlocking(false);
        clientChannel.register(selector, SelectionKey.OP_READ);
        System.out.println(ConsoleTextHelper.COLOR_GREEN + ConsoleTextHelper.TCP_PREFIX + "Новое соединение: " + clientChannel.getRemoteAddress());
    }


    /**
     * Обработчик, если событие - это сообщение
     */
    @Override
    public void onReceiveMessage(SelectionKey key) {
        SocketChannel clientChannel = (SocketChannel) key.channel();
        try {
            String message = readMessage(clientChannel).replaceAll("[\\n\\t\\r]", "");

            //Если сообщение пустое, значит соединение было закрыто
            if (message.isEmpty()) {
                clientChannel.close();
                connections.values().remove(clientChannel);
                System.out.println(ConsoleTextHelper.COLOR_YELLOW + ConsoleTextHelper.TCP_PREFIX + "Клиент отключился " + clientChannel.getRemoteAddress());
                return;
            }

            System.out.println(ConsoleTextHelper.COLOR_GREEN + ConsoleTextHelper.TCP_PREFIX + "Получено сообщение: " + message);

            String[] protocolAndData = message.split(Separators.BASE_PATH.getName(), 2);

             switch (protocolAndData[0]) {
                 case AuthToServerProtocol.basePath -> {
                     String[] sendMessageProtocolData = protocolAndData[1].split(Separators.SUB_PATH.getName(), AuthToServerProtocol.protocolSize);
                     connections.put(Integer.parseInt(sendMessageProtocolData[AuthToServerProtocol.userIdProtocolPosition]), clientChannel);
                 }
                 case SendMessageToServerProtocol.basePath -> {
                     String[] sendMessageProtocolData = protocolAndData[1].split(Separators.SUB_PATH.getName(), SendMessageToServerProtocol.protocolSize);
                     sendMessage(
                             sendMessageProtocolData[SendMessageToServerProtocol.receiverIdProtocolPosition],
                             protocolService.collectSendMessageToClientProtocol(
                                     sendMessageProtocolData[SendMessageToServerProtocol.senderIdProtocolPosition],
                                     sendMessageProtocolData[SendMessageToServerProtocol.messageProtocolPosition]
                             )
                     );
                 }
             }
        } catch (Exception ex) {
            try {
                clientChannel.socket().close();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    private void sendMessage(String receiverId, String message) throws IOException {
        SocketChannel receiverClient = connections.get(Integer.parseInt(receiverId));
        ByteBuffer buffer = ByteBuffer.wrap(message.getBytes());
        receiverClient.write(buffer);
        buffer.rewind();
    }

    private String readMessage(SocketChannel clientChannel) throws IOException {
        ByteBuffer buffer = ByteBuffer.allocate(1024);
        clientChannel.read(buffer);
        buffer.flip();
        return new String(buffer.array(), 0, buffer.limit());
    }
}