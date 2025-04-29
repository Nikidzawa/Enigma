export default class PrivateChatDto {
    constructor(chatId, ownerId, companionId) {
        this.chatId = chatId;
        this.ownerId = ownerId;
        this.companionId = companionId;
    }

    static fromJSON(data) {
        return new PrivateChatDto(
            data.chatId,
            data.ownerId,
            data.companionId
        )
    }
}