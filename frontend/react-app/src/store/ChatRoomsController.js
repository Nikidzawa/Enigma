import { makeAutoObservable } from "mobx";
import UserApi from "../api/internal/controllers/UserApi";
import UserDto from "../api/internal/dto/UserDto";
import MessageReadResponse from "../network/response/MessageReadResponse";
import MessageDto from "../api/internal/dto/MessageDto";
import ChatRoomDto from "../api/internal/dto/ChatRoomDto";

class ChatRoomsController {
    chatRooms = [];
    stompClient = null;
    subscriptions = new Map(); // Для управления подписками

    constructor() {
        makeAutoObservable(this);
    }

    getChatRooms() {
        return this.chatRooms;
    }

    setChatRooms(chatRooms) {
        this.chatRooms = chatRooms;
    }

    init(chatRooms, stompClient, userId) {
        this.cleanupSubscriptions();
        this.chatRooms = chatRooms;
        this.stompClient = stompClient;

        this.initReceiveMessages(userId);
        this.initChatRoomsSubscriptions();
    }

    cleanupSubscriptions() {
        this.subscriptions.forEach((unsubscribe) => unsubscribe());
        this.subscriptions.clear();
    }

    initReceiveMessages(userId) {
        const subscription = this.stompClient.subscribe(
            `/client/${userId}/queue/messages`,
            this.handleIncomingMessage
        );
        this.subscriptions.set(`messages-${userId}`, subscription.unsubscribe);
    }

    initChatRoomsSubscriptions() {
        this.chatRooms.forEach((chatRoom) => {
            this.initChatRoomSubscriptions(chatRoom);
        });
    }

    initChatRoomSubscriptions(chatRoom) {
        const companionId = chatRoom.companion.id;

        // Подписка на изменения профиля
        const profileSubscription = this.stompClient.subscribe(
            `/client/${companionId}/profile/changed`,
            this.handleProfileChange
        );
        this.subscriptions.set(`profile-${companionId}`, profileSubscription.unsubscribe);

        // Подписка на статус прочтения сообщений
        const readStatusSubscription = this.stompClient.subscribe(
            `/client/${companionId}/queue/read`,
            this.handleMessageReadStatus
        );
        this.subscriptions.set(`read-status-${companionId}`, readStatusSubscription.unsubscribe);
    }

    handleIncomingMessage = async (message) => {
        const messageDto = MessageDto.fromRequest(JSON.parse(message.body));
        try {
            const response = await UserApi.getUserById(messageDto.senderId);
            this.updateLastMessageOrAddChat({
                message: messageDto,
                companion: UserDto.fromJSON(response.data),
            });
        } catch (error) {
            console.error("Failed to handle incoming message:", error);
        }
    };

    handleProfileChange = async (message) => {
        try {
            const { userId } = JSON.parse(message.body);
            const response = await UserApi.getUserById(userId);
            const userDto = UserDto.fromJSON(response.data);

            this.updateChatRoomCompanion(userDto);
        } catch (error) {
            console.error("Failed to handle profile change:", error);
        }
    };

    handleMessageReadStatus = (message) => {
        const messageReadResponse = MessageReadResponse.fromJSON(JSON.parse(message.body));
        this.updateMessageReadStatus(messageReadResponse.messageId);
    };

    updateChatRoomCompanion(userDto) {
        this.chatRooms = this.chatRooms.map((chat) =>
            chat.companion.id === userDto.id ? { ...chat, companion: userDto } : chat
        );
    }

    updateMessageReadStatus(messageId) {
        this.chatRooms = this.chatRooms.map((chat) => {
            const lastMessage = chat.messages[chat.messages.length - 1];
            if (lastMessage?.id === messageId) {
                return {
                    ...chat,
                    messages: chat.messages.map((msg, idx) =>
                        idx === chat.messages.length - 1 ? { ...msg, isRead: true } : msg
                    ),
                };
            }
            return chat;
        });
    }

    updateLastMessageOrAddChat({ message, companion }) {
        const existingChatIndex = this.chatRooms.findIndex(
            (chat) => chat.companion.id === companion.id
        );

        if (existingChatIndex !== -1) {
            const updatedChats = [...this.chatRooms];
            updatedChats[existingChatIndex] = {
                ...updatedChats[existingChatIndex],
                messages: [...updatedChats[existingChatIndex].messages, message],
            };
            this.chatRooms = updatedChats;
        } else {
            this.chatRooms = [
                ...this.chatRooms,
                new ChatRoomDto(companion, [message], null),
            ];
        }
    }

    findChatByUserDtoOrGetNew(userDto) {
        return (
            this.chatRooms.find((chat) => chat.companion.id === userDto.id) ||
            new ChatRoomDto(userDto, [], null)
        );
    }

    destroy() {
        this.cleanupSubscriptions();
    }
}

export default new ChatRoomsController();