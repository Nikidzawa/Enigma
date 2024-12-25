package ru.nikidzawa;

import ru.nikidzawa.websocketProxyServer.WebsocketProxyServer;
import ru.nikidzawa.tcpServer.TCPServerStarter;

public class Starter {
    private static final int TCP_SERVER_PORT = 8090;
    private static final int WEBSOCKET_PROXY_SERVER_PORT = 8095;
    private static final String HOST = "localhost";

    public static void main(String[] args) throws InterruptedException {
        new Thread(() -> new TCPServerStarter(HOST, TCP_SERVER_PORT)).start();
        Thread.sleep(3000);
        new Thread(() -> new WebsocketProxyServer(HOST, WEBSOCKET_PROXY_SERVER_PORT, TCP_SERVER_PORT)).start();
    }
}
