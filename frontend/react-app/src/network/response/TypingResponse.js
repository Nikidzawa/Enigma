export default class TypingResponse {
    constructor(isTyping) {
        this.isTyping = isTyping;
    }

    static fromJSON(data) {
        return new TypingResponse (
            data.isTyping,
        )
    }
}