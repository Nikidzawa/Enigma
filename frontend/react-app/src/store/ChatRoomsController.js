import {makeAutoObservable, runInAction} from "mobx";
import UserApi from "../api/internal/controllers/UserApi";
import MessageReadResponse from "../network/chat/message/read/MessageReadResponse";
import MessageDto from "../api/internal/dto/MessageDto";
import ChatRoomDto from "../api/internal/dto/ChatRoomDto";
import IndividualDtoShort from "../api/internal/dto/IndividualDtoShort";
import PresenceResponse from "../network/chat/user/PresenceResponse";
import UserController from "./UserController";
import MessageDeleteResponse from "../network/chat/message/delete/MessageDeleteResponse";
import {StorableRequest as EditResponse} from "workbox-background-sync";
import MessageEditResponse from "../network/chat/message/edit/MessageEditResponse";

class ChatRoomsController {
    chatRooms = [];
    activeChat = null;
    stompClient = null;
    subscriptions = new Map();

    constructor() {
        makeAutoObservable(this);
    }

    getChatRooms() {
        return this.chatRooms;
    }

    initAll(chatRooms, stompClient, userId) {
        this.cleanupSubscriptions();
        this.chatRooms = chatRooms;
        this.stompClient = stompClient;

        this.initReceiveMessages(userId);
        this.chatRooms.forEach((chatRoom) => {
            this.initChatRoomSubscriptions(userId, chatRoom);
        });
    }

    cleanupSubscriptions() {
        this.subscriptions.forEach((unsubscribe) => unsubscribe());
        this.subscriptions.clear();
    }

    initReceiveMessages(userId) {
        const subscription = this.stompClient.subscribe(`/client/${userId}/queue/messages`,
            this.handleIncomingMessage
        );
        this.subscriptions.set(`messages-${userId}`, subscription.unsubscribe);
    }

    initChatRoomSubscriptions(userId, chatRoom) {
        const companionId = chatRoom.companion.id;

        // Подписка на получение онлайн статуса пользователя
        const presenceSubscription = this.stompClient.subscribe(`/client/${companionId}/personal/presence`,
            this.changeOnline
        );
        this.subscriptions.set(`presence-${companionId}`, presenceSubscription.unsubscribe);

        // Подписка на изменения профиля
        const profileSubscription = this.stompClient.subscribe(`/client/${companionId}/profile/changed`,
            this.handleProfileChange
        );
        this.subscriptions.set(`profile-${companionId}`, profileSubscription.unsubscribe);

        // Подписка на статус прочтения сообщений
        const readStatusSubscription = this.stompClient.subscribe(`/client/${userId}/queue/chat/private/${companionId}/read`, (message) => {
            const messageReadResponse = MessageReadResponse.fromRequest(JSON.parse(message.body));
            this.handleMessageReadStatus(messageReadResponse.messageId, chatRoom.companion.id);
        });
        this.subscriptions.set(`read-status-${companionId}`, readStatusSubscription.unsubscribe);

        // Подписка на обновление сообщений
        const editMessageSubscription = this.stompClient.subscribe(`/client/${userId}/queue/chat/private/${companionId}/edit`, (message) => {
            const updatedMessage = MessageEditResponse.fromRequest(JSON.parse(message.body));
            this.editMessage(companionId, updatedMessage.messageId, updatedMessage.editedAt, updatedMessage.text)
        });
        this.subscriptions.set(`edit-message-${companionId}`, editMessageSubscription.unsubscribe);

        // Подписка на удаление сообщения
        const deleteMessageSubscription = this.stompClient.subscribe(`/client/${userId}/queue/chat/private/${companionId}/delete`, (message) => {
            const messageDeleteResponse = MessageDeleteResponse.fromRequest(JSON.parse(message.body));
            this.handleDeleteMessage(messageDeleteResponse.messageId, chatRoom.companion.id);
        });
        this.subscriptions.set(`delete-message-${companionId}`, deleteMessageSubscription.unsubscribe);
    }

    setActiveChat(companion) {
        this.activeChat = () => this.chatRooms.find(chat => chat.companion.id === companion.id) || new ChatRoomDto(companion, [], null, 0);
    }

    clearActiveChat() {
        this.activeChat = null;
    }

    getActiveChat() {
        return this.activeChat?.();
    }

    handleDeleteMessage = (messageId, companionId) => {
        this.chatRooms = this.chatRooms.map(chatRoom =>
            chatRoom.companion.id === companionId
                ? {
                    ...chatRoom,
                    messages: chatRoom.messages.filter(msg => msg.id !== messageId),
                    unreadCount: chatRoom.messages.some(msg => msg.id === messageId && !msg.isRead)
                        ? chatRoom.unreadCount - 1
                        : chatRoom.unreadCount
                }
                : chatRoom
        );
    };

    handleIncomingMessage = async (message) => {
        const messageDto = MessageDto.fromRequest(JSON.parse(message.body));
        try {
            const response = await UserApi.getUserById(messageDto.senderId);
            const companion = IndividualDtoShort.fromJSON(response.data);
            this.updateLastMessageOrAddChat({
                message: messageDto,
                companion: companion,
            });

            this.addNotification(companion.id)
        } catch (error) {
            console.error("Failed to handle incoming message:", error);
        }
    };

    changeOnline = async (message) => {
        const presenceResponse = PresenceResponse.fromJSON(JSON.parse(message.body));
        if (presenceResponse.lastOnlineDate) {
            this.chatRooms = this.chatRooms.map((chat) =>
                chat.companion.id === presenceResponse.userId ? {
                    ...chat, companion: {...chat.companion, lastLogoutDate: presenceResponse.lastOnlineDate}
                } : chat
            );
        }
    }

    handleProfileChange = async (message) => {
        const { userId } = JSON.parse(message.body);
        const response = await UserApi.getUserById(userId);
        const userDto = IndividualDtoShort.fromJSON(response.data);
        this.updateChatRoomCompanion(userDto);
    };

    handleMessageReadStatus = (messageId, companionId) => {
        this.chatRooms = this.chatRooms.map(chatRoom =>
            chatRoom.companion.id === companionId
                ? {...chatRoom, messages: chatRoom.messages.map(message => message.id === messageId ? { ...message, isRead: true } : message)}
                : chatRoom
        );
    };

    updateChatRoomCompanion(userDto) {
        this.chatRooms = this.chatRooms.map((chat) =>
            chat.companion.id === userDto.id ? { ...chat, companion: userDto } : chat
        );
    }

    addMessagesInStart(companionId, newMessages) {
        const existingChatIndex = this.chatRooms.findIndex(
            (chat) => chat.companion.id === companionId
        );

        if (existingChatIndex !== -1) {
                this.chatRooms[existingChatIndex].messages =[
                    ...this.defaultSort(newMessages),
                    ...this.chatRooms[existingChatIndex].messages
                ];
        }
    }

    defaultSort(array) {
        return array.sort((a, b) => a.id - b.id);
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
            const newChatRoom = new ChatRoomDto(companion, [message], {chatId: message.chatId}, 0);
            this.chatRooms = [...this.chatRooms, newChatRoom];
            this.initChatRoomSubscriptions(UserController.getCurrentUser().id, newChatRoom)
        }
    }

    async removeMessage(messageId, companionId) {
        const existingChatIndex = this.chatRooms.findIndex((chat) => chat.companion.id === companionId);

        if (existingChatIndex !== -1) {
            this.chatRooms = this.chatRooms.map((chat) => {
                return {...chat, messages: chat.messages.filter(msg => msg.id !== messageId)};
            });
        }
    }

    removeChatRoom(companionId) {
        this.chatRooms = this.chatRooms.filter(chat => chat.companion.id !== companionId);
    }

    removeNotification(companionId) {
        this.chatRooms = this.chatRooms.map(chat =>
            chat.companion.id === companionId ? {...chat, unreadCount: chat.unreadCount - 1} : chat
        );
    }

    addNotification(companionId) {
        this.chatRooms = this.chatRooms.map(chat =>
            chat.companion.id === companionId ? {...chat, unreadCount: chat.unreadCount += 1} : chat
        );
    }

    // Либо MessageDto, либо MessageEditResponse
    editMessage(companionId, messageId, editedAt, text) {
        this.chatRooms = this.chatRooms.map(chatRoom =>
            chatRoom.companion.id === companionId
                ? {...chatRoom, messages: chatRoom.messages.map(message => message.id === messageId ? { ...message, text: text, isEdited: true, editedAt: editedAt } : message)}
                : chatRoom
        );
    }
}

export default new ChatRoomsController();