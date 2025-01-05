export default class MessageDto {
    constructor(id, createdAt, text, senderId) {
        this.id = id;
        this.createdAt = new Date(createdAt);
        this.text = text;
        this.senderId = senderId;
    }

    static fromJSON(data) {
        return new MessageDto(
            data.id,
            data.createdAt,
            data.text,
            data.senderId
        );
    }
}
