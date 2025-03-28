export default class MessageRequest {
    constructor(id, createdAt, senderId, receiverId, message) {
        this.id = Number.parseInt(id);
        this.createdAt = createdAt;
        this.senderId = Number.parseInt(senderId);
        this.receiverId = Number.parseInt(receiverId);
        this.message = message;
    }

    static fromJSON(data) {
        return new MessageRequest(
            data.id,
            data.createdAt,
            data.senderId,
            data.receiverId,
            data.message
        )
    }
}