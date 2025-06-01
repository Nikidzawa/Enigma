export default class PrivateChatDto {
    constructor(chatId, chatType, ownerId, companionId) {
        this.chatId = chatId;
        this.chatType = chatType;
        this.ownerId = ownerId;
        this.companionId = companionId;
    }

    static fromJSON(data) {
        return new PrivateChatDto(
            data.chatId,
            data.chatType,
            data.ownerId,
            data.companionId
        )
    }
}