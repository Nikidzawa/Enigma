export default class MessageDto {
    constructor(id, senderId, chatId, sentAt, text, isPinned, isEdited, editedAt, isRead) {
        this.id = id;
        this.senderId = senderId;
        this.chatId = chatId;
        this.sentAt = sentAt;
        this.text = text;
        this.isPinned = isPinned || false;
        this.isEdited = isEdited || false;
        this.editedAt = editedAt;
        this.isRead = isRead || false;
    }

    static fromJSON(data) {
        return new MessageDto(
            data.id,
            data.senderId,
            data.chatId,
            new Date(`${data.sentAt}Z`),
            data.text,
            data.isPinned || false,
            data.isEdited || false,
            new Date(`${data.createdAt}Z`),
            data.isRead || false
        );
    }

    static fromRequest(data) {
        return new MessageDto(
            Number.parseInt(data.id),
            Number.parseInt(data.senderId),
            Number.parseInt(data.chatId),
            new Date(`${data.createdAt}`),
            data.message,
        )
    }
}
