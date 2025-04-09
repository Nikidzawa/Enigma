export default class MessageReadResponse {
    constructor(userId, messageId) {
        this.userId = userId;
        this.messageId = messageId
    }

    static fromJSON(data) {
        return new MessageReadResponse (
            Number.parseInt(data.userId),
            Number.parseInt(data.messageId)
        )
    }
}