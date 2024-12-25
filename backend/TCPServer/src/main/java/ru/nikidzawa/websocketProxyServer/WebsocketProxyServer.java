package ru.nikidzawa.websocketProxyServer;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import ru.nikidzawa.ConsoleTextHelper;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SocketChannel;

public class WebsocketProxyServer extends WebSocketServer {

    private final int tcpServerPort;
    private final String host;
    private SocketChannel socketChannel;

    public WebsocketProxyServer(String host, int websocketProxyServerPort, int tcpServerPort) {
        super(new InetSocketAddress(host, websocketProxyServerPort));
        this.tcpServerPort = tcpServerPort;
        this.host = host;
        start();
        System.out.println(ConsoleTextHelper.COLOR_GREEN + ConsoleTextHelper.WS_PREFIX + "[✔] Websocket Proxy Сервер запущен на порту " + websocketProxyServerPort);
    }

    @Override
    public void onOpen(WebSocket webSocket, ClientHandshake clientHandshake) {
        System.out.println(ConsoleTextHelper.COLOR_GREEN + ConsoleTextHelper.WS_PREFIX + "Новое соединение " + webSocket.getLocalSocketAddress());
    }

    @Override
    public void onClose(WebSocket webSocket, int i, String s, boolean b) {
        System.out.println(ConsoleTextHelper.COLOR_YELLOW + ConsoleTextHelper.WS_PREFIX + "Соединение отключено " + webSocket.getLocalSocketAddress());
    }

    @Override
    public void onMessage(WebSocket webSocket, String s) {
        System.out.println(ConsoleTextHelper.COLOR_GREEN + ConsoleTextHelper.WS_PREFIX + "Получено сообщение " + s);
        try {
            socketChannel.write(ByteBuffer.wrap(s.getBytes()));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void onError(WebSocket webSocket, Exception e) {
        System.out.println(ConsoleTextHelper.COLOR_RED + ConsoleTextHelper.WS_PREFIX + "Ошибка " + webSocket.getLocalSocketAddress());
    }


    @Override
    public void onStart() {
        try {
            socketChannel = SocketChannel.open(new InetSocketAddress(host, tcpServerPort));
            socketChannel.write(ByteBuffer.wrap("Websocket Proxy Server проверка соединения".getBytes()));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
