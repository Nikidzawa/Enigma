import api from "../Api";
import protectedApi from "../ProtectedApi";

export default class ChatApi {

    static async getAllByOwnerId(ownerId) {
        return api.get(`/chats/${ownerId}/all`)
    }
}