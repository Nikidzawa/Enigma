import {makeAutoObservable} from "mobx";
import {Client} from "@stomp/stompjs";
import UserController from "./UserController";
import PresenceCheckResponse from "../network/chat/user/PresenceCheckResponse";
import TypingRequest from "../network/chat/typing/TypingRequest";
import MessageDeleteRequest from "../network/chat/message/delete/MessageDeleteRequest";
import MessageReadRequest from "../network/chat/message/read/MessageReadRequest";
import MessageEditRequest from "../network/chat/message/edit/MessageEditRequest";

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

    getTypingSubscription(currentUserId, companionId) {
        return `/client/${currentUserId}/queue/chat/private/${companionId}/typing`;
    }

    getDeleteMessageSubscription(currentUserId, companionId) {
        return `/client/${currentUserId}/queue/chat/private/${companionId}/typing`
    }

    async sendMessage(message) {
        if (this.client.connected) {
            this.client.publish({
                destination: '/server/message/send',
                body: JSON.stringify(message)
            });
        }
    }

    async editMessage(companionId, updatedMessage) {
        this.client.publish({
            destination: '/server/message/edit',
            body: JSON.stringify(new MessageEditRequest(companionId, UserController.getCurrentUser().id, updatedMessage.id, updatedMessage.editedAt, updatedMessage.text))
        })
    }

    async deleteMessage(messageId, companionId) {
        this.client.publish({
            destination: '/server/message/delete',
            body: JSON.stringify(new MessageDeleteRequest(companionId, UserController.getCurrentUser().id, messageId))
        })
    }

    async updateUserProfile(userId) {
        this.client.publish({
            destination: '/server/profile/changed',
            body: JSON.stringify({userId: userId})
        })
    }

    async privateChatTyping(companionId) {
        this.client.publish({
            destination: '/server/chat/private/typing',
            body: JSON.stringify(new TypingRequest(UserController.getCurrentUser().id, companionId, true))
        })
    }

    async read(companionId, messageId) {
        this.client.publish({
            destination: '/server/message/read',
            body: JSON.stringify(new MessageReadRequest(companionId, UserController.getCurrentUser().id, messageId))
        })
    }

    checkPresence(targetId) {
        this.client.publish({
            destination: '/server/presence/check',
            body: JSON.stringify(new PresenceCheckResponse(targetId))
        })
    }

    getClient() {
        return this.client;
    }
}

export default new ClientController();