import api from "../Api";

export default class MessagesApi {

    static async getMessagesByChatId(chatId, lastMessageId) {
        return api.get(`messages/getByChatId/${chatId}?lastMessageId=${lastMessageId || 0}`)
    }

    static async save(message) {
        return api.post(`/messages/save`, message);
    }

    static read(messageId) {
        api.put(`/messages/read/${messageId}`);
    }
}