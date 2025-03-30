export default class PresenceResponse {
    constructor(userId, isOnline) {
        this.userId = Number.parseInt(userId);
        this.isOnline = isOnline;
    }

    static fromJSON(data) {
        return new PresenceResponse (
            data.userId,
            data.isOnline
        )
    }
}