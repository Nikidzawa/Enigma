package ru.nikidzawa.tcpServer.network;

import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;

public interface ServerListener {
    void onConnectionReady(SelectionKey key, Selector selector);

    void onReceiveMessage(SelectionKey key);
}