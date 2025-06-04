export default class PresenceResponse {
    constructor(userId, isOnline, lastOnlineDate) {
        this.userId = Number.parseInt(userId);
        this.isOnline = isOnline;
        this.lastOnlineDate = lastOnlineDate;
    }

    static fromJSON(data) {
        return new PresenceResponse (
            data.userId,
            data.isOnline,
            data.lastOnlineDate && new Date(data.lastOnlineDate)
        )
    }
}