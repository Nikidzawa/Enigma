import {makeAutoObservable} from "mobx";
import {Client} from "@stomp/stompjs";

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

                // Подписка на персональные уведомления по полученным сообщениям
                stompClient.subscribe(`/client/${userId}/queue/messages`, messageHandler);

            },
            onStompError: (error) => {
                console.error(error.message);
                localStorage.removeItem("TOKEN");
                window.location.href = '/login';
            }
        });
        stompClient.activate();
    }

    async disconnect() {
        if (this.client && this.client.connected) {
            this.client.deactivate()
        }
    }

    async sendMessage(message) {
        if (this.client.connected) {
            this.client.publish({
                destination: '/server/message/send',
                body: JSON.stringify(message)
            });
        }
    }

    async updateUserProfile(userId) {
        this.client.publish({
            destination: '/server/profile/changed',
            body: JSON.stringify({userId: userId})
        })
    }

    getClient() {
        return this.client;
    }
}

export default new ClientController();