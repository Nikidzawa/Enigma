export default class MessageEditRequest {
    constructor(subscriberId, chatId, messageId, editedAt, text) {
        this.subscriberId = subscriberId;
        this.chatId = chatId;
        this.messageId = messageId;
        this.editedAt = editedAt;
        this.text = text;
    }
}