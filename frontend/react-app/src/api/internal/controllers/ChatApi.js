import api from "../Api";
import protectedApi from "../ProtectedApi";

export default class ChatApi {

    static async getAllUserChatsByUserId(userId) {
        return api.get(`/chats/getAllUserChats/${userId}`)
    }

    static getOrCreateNewIndividualChat(ownerId, companionId) {
        return protectedApi.post(`/chats/getOrCreate?ownerId=${ownerId}&companionId=${companionId}`);
    }
}