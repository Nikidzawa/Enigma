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

    async connect(userId, messageHandler) {
        const { Client } = require('@stomp/stompjs');
        const SockJS = require('sockjs-client');

        const stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8090/ws'),
            onConnect: () => {
                this.client = stompClient;
                stompClient.subscribe(`/client/${userId}/queue/messages`, messageHandler);
            },
            onStompError: (error) => {
                console.error('Websocket error: ', error);
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

    getClient() {
        return this.client;
    }
}

export default new ClientController();