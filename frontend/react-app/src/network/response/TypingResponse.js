export default class TypingResponse {
    constructor(userId, isTyping) {
        this.userId = Number.parseInt(userId);
        this.isTyping = isTyping;
    }

    static fromJSON(data) {
        return new TypingResponse (
            data.userId,
            data.isTyping,
        )
    }
}