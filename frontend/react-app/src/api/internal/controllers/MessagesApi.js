import api from "../Api";

export default class MessagesApi {

    static async getMessagesByChatId(chatId, lastMessageId) {
        return api.get(`messages/getByChatId/${chatId}?lastMessageId=${lastMessageId}`)
    }

    static async getMessagesBySenderIdAndReceiverId(senderId, receiverId) {
        return api.get(`messages/get?senderId=${senderId}&receiverId=${receiverId}`)

    }

    static save(senderId, receiverId, message) {
        return api.post(`/messages/send?senderId=${senderId}&receiverId=${receiverId}`, message);
    }

    static async read(messageId) {
        api.put(`/messages/read/${messageId}`);
    }
}