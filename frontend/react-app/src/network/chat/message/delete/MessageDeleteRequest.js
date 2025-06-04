export default class MessageDeleteRequest {
    constructor(subscriberId, chatId, messageId) {
        this.subscriberId = subscriberId;
        this.chatId = chatId;
        this.messageId = messageId;
    }
}