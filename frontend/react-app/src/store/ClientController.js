import {makeAutoObservable} from "mobx";
import {Client} from "@stomp/stompjs";
import TypingResponse from "../network/response/TypingResponse";
import MessageReadResponse from "../network/response/MessageReadResponse";
import UserController from "./UserController";

class ClientController {

    client = null;

    constructor() {
        makeAutoObservable(this);
    }

    async connect(userId) {
        const { Client } = require('@stomp/stompjs');
        const SockJS = require('sockjs-client');

        const stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8090/ws'),
            connectHeaders: {
                id: userId
            },
            onConnect: () => {
                this.client = stompClient;
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

    async typing() {
        this.client.publish({
            destination: '/server/chat/typing',
            body: JSON.stringify(new TypingResponse(UserController.getCurrentUser().id, true))
        })
    }

    async read(messageId) {
        this.client.publish({
            destination: '/server/message/read',
            body: JSON.stringify(new MessageReadResponse(UserController.getCurrentUser().id, messageId))
        })
    }

    getClient() {
        return this.client;
    }
}

export default new ClientController();