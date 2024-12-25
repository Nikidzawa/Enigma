package ru.nikidzawa.tcpServer;

import ru.nikidzawa.ConsoleTextHelper;
import ru.nikidzawa.tcpServer.network.Server;

public class TCPServerStarter {
    public TCPServerStarter (String host, int tcpServerPort) {
        System.out.println(ConsoleTextHelper.COLOR_GREEN);
        System.out.println(
                """
                #######   ##     ##   ##   #######   ##      ###       ##         ########   #######   #######   ##       ##   #######   #######
                ##        ####   ##        ##        ####   ####      ####        ##         ##        ##   ##    ##     ##    ##        ##   ##
                #####     ## ##  ##   ##   ##  ###   ## ## ## ##     ##  ##       ########   #####     #######     ##   ##     #####     #######
                ##        ##  ## ##   ##   ##   ##   ##  ##   ##    ########            ##   ##        ##  ##       ## ##      ##        ##  ##
                #######   ##   ####   ##   #######   ##       ##   ##      ##     ########   #######   ##   ##       ##        #######   ##   ##
                """
        );
        System.out.println("[...] Запуск сервера");

        try {
            new Server(host, tcpServerPort);
        } catch (Exception e) {
            System.out.println(ConsoleTextHelper.COLOR_RED + ConsoleTextHelper.TCP_PREFIX + "[✖] Сервер остановлен");
            throw new RuntimeException(e);
        }
    }
}