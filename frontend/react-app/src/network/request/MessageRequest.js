export default class MessageRequest {
    constructor(id, createdAt, senderId, receiverId, message) {
        this.id = id;
        this.createdAt = createdAt;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.message = message;
    }

    static fromJSON(data) {
        return new MessageRequest(
            data.type,
            data.id,
            data.createdAt,
            data.senderId,
            data.receiverId,
            data.message
        )
    }
}