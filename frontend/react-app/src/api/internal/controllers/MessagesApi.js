import BaseApiPath from "../ProtectedApi";
import api from "../Api";

export default class MessagesApi extends BaseApiPath {

    static async getMessagesByChatId(chatId, lastMessageId) {
        return api.get(`messages/getByChatId/${chatId}?lastMessageId=${lastMessageId}`)
    }

    static async getMessagesBySenderIdAndReceiverId(senderId, receiverId) {
        return api.get(`messages/get?senderId=${senderId}&receiverId=${receiverId}`)

    }

    static send(senderId, receiverId, message) {
        return api.post(`/messages/send?senderId=${senderId}&receiverId=${receiverId}`, message);
    }
}