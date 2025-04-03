import api from "../Api";

export default class PresenceApi {

    static getActual(userId) {
        return api.get(`/presence/actual?userId=${userId}`)
    }

}