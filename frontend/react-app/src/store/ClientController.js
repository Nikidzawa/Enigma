import {makeAutoObservable} from "mobx";
import {Client} from "@stomp/stompjs";
import ChatsController from "./ChatsController";
import MessageRequest from "../network/request/MessageRequest";
import MessageDto from "../api/internal/dto/MessageDto";

class ClientController {

    client = null;

    constructor() {
        makeAutoObservable(this);
    }

    async connect(userId, messageHandler, presenceHandler) {
        const { Client } = require('@stomp/stompjs');
        const SockJS = require('sockjs-client');

        const stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8090/ws'),
            connectHeaders: {
                id: userId
            },
            onConnect: () => {
                this.client = stompClient;
                console.log('Connected!');
                // Подписка на персональные уведомления по сообщениям
                stompClient.subscribe(`/client/${userId}/queue/messages`, messageHandler);

                // Подписка на персональные уведомления по статусу
                stompClient.subscribe(`/client/${userId}/queue/presence`, presenceHandler);
            },
            onStompError: (error) => {
                console.error(error.message);
                localStorage.removeItem("TOKEN");
                window.location.href = '/login';
            }
        });

        stompClient.activate();
    }
    async sendMessage(message) {
        if (this.client.connected) {
            this.client.publish({
                destination: '/server/message/send',
                body: JSON.stringify(message)
            });
        }
    }

    async checkUserOnlineStatus(userId) {
        this.client.publish({
            destination: '/server/presence/check',
            body: JSON.stringify({userId: userId})
        })
    }

    getClient() {
        return this.client;
    }
}

export default new ClientController();