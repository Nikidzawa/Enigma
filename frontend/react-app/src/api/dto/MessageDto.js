export default class MessageDto {
    constructor(id, createdAt, text, senderId, chatId) {
        this.id = id;
        this.createdAt = new Date(createdAt);
        this.text = text;
        this.senderId = senderId;
        this.chatId = chatId;
    }

    static fromJSON(data) {
        return new MessageDto(
            data.id,
            data.createdAt,
            data.text,
            data.senderId,
            data.chatId
        );
    }
}
