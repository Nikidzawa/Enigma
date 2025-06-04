export default class MessageReadResponse {
    constructor(messageId) {
        this.messageId = messageId
    }

    static fromRequest(data) {
        return new MessageReadResponse (
            Number.parseInt(data.messageId)
        )
    }
}