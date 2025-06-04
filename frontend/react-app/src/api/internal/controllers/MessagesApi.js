import api from "../Api";

export default class MessagesApi {

    static async getMessagesByChatId(chatId) {
        return api.get(`messages/chatId/${chatId}`)
    }

    static async getMessagesByChatIdAndLastMessageId(chatId, lastMessageId) {
        return api.get(`messages/chatId/${chatId}/lastMessageId/${lastMessageId}`)

    }

    static async save(message) {
        return api.post(`/messages/save`, message);
    }

    static async edit(messageId, text) {
        return api.put(`/messages/edit/${messageId}?text=${text}`)
    }

    static async read(messageId) {
        api.put(`/messages/read/${messageId}`);
    }

    static async del(messageId) {
        return api.delete(`/messages/delete/${messageId}`);
    }
}