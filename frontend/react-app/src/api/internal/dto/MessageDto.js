export default class MessageDto {
    constructor(id, createdAt, text, senderId, isRead) {
        this.id = id;
        this.createdAt = createdAt;
        this.text = text;
        this.senderId = senderId;
        this.isRead = isRead || false;
    }

    static fromJSON(data) {
        return new MessageDto(
            data.id,
            new Date(`${data.createdAt}Z`),
            data.text,
            data.senderId,
            data.isRead || false
        );
    }

    static fromRequest(data) {
        return new MessageDto(
            Number.parseInt(data.id),
            new Date(`${data.createdAt}`),
            data.message,
            Number.parseInt(data.senderId)
        )
    }
}
