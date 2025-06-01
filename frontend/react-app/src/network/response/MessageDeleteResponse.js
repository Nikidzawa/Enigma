export default class MessageDeleteResponse {
    constructor(messageId) {
        this.messageId = messageId;
    }

    static fromRequest(data) {
        return new MessageDeleteResponse(
            Number.parseInt(data.messageId)
        );
    }
}