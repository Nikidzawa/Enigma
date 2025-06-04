import MessageEditRequest from "./MessageEditRequest";

export default class MessageEditResponse {
    constructor(messageId, editedAt, text) {
        this.messageId = messageId;
        this.editedAt = editedAt;
        this.text = text;
    }

    static fromRequest (data) {
        return new MessageEditResponse(
            Number.parseInt(data.messageId),
            new Date(data.editedAt),
            data.text
        )
    }
}