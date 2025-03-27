export default class IndividualChatDto {
    constructor(id, ownerId, companionId, createdAt) {
        this.id = id;
        this.ownerId = ownerId;
        this.companionId = companionId;
        this.createdAt = createdAt;
    }

    static fromJSON(data) {
        return new IndividualChatDto(
            data.id,
            data.ownerId,
            data.companionId,
            new Date(`${data.createdAt}Z`)
        )
    }
}