import api from "../Api";
import protectedApi from "../ProtectedApi";

export default class ChatApi {

    static async getAllUserChatsByUserId(userId) {
        return api.get(`/chats/getAllUserChats/${userId}`)
    }
}