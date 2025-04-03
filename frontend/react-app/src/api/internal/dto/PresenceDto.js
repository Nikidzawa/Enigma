export default class PresenceDto {
    constructor(individualId, isOnline, lastOnlineDate) {
        this.individualId = individualId;
        this.isOnline = isOnline;
        this.lastOnlineDate = lastOnlineDate;
    }

    static fromJSON(data) {
        return new PresenceDto(
            data.individualId,
            data.isOnline,
            new Date(data.lastOnlineDate)
        )
    }
}