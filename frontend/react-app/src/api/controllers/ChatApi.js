import api from "../Api";

export default class ChatApi {

    static async getAllUserChatsByUserId(userId) {
        return api.get(`/chats/getAllUserChats/${userId}`)
    }
}