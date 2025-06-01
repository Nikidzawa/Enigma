import api from "../Api";

export default class ChatApi {

    static async getAllByOwnerId(ownerId) {
        return api.get(`/chats/${ownerId}/all`)
    }

    static async findOrCreateChat(ownerId, companionId) {
        return api.get(`/chats/findOrCreateChat?ownerId=${ownerId}&companionId=${companionId}`);
    }
}