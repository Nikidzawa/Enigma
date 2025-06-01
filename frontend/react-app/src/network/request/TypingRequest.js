export default class TypingRequest {
    constructor(writerId, targetId, isTyping) {
        this.writerId = writerId;
        this.targetId = targetId;
        this.isTyping = isTyping;
    }
}