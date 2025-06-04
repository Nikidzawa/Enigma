export default class MessageSendRequest {
    constructor(id, createdAt, senderId, receiverId, chatId, message) {
        this.id = Number.parseInt(id);
        this.createdAt = createdAt;
        this.senderId = Number.parseInt(senderId);
        this.receiverId = Number.parseInt(receiverId);
        this.chatId = Number.parseInt(chatId);
        this.message = message;
    }

    static fromJSON(data) {
        return new MessageSendRequest(
            data.id,
            data.createdAt,
            data.senderId,
            data.receiverId,
            data.message
        )
    }
}