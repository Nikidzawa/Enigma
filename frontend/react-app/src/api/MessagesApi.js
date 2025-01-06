import BaseApiPath from "./BaseApiPath";
import MessageDto from "./dto/MessageDto";
import ActiveChatController from "../store/ActiveChatController";

export default class MessagesApi extends BaseApiPath {
    static path = `${this.basePath}/messages`

    static async getMessagesByChatId(chatId, lastMessageId) {
        const url = `${this.path}/getByChatId/${chatId}?lastMessageId=${lastMessageId}`;
        const response = await fetch(url);
        const json = await response.json();
        return json.map(data => MessageDto.fromJSON(data));
    }

    static async save(message) {
        const url = `${this.path}/new/${ActiveChatController.getCurrentUser().chatId}`;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
        };
        return fetch(url, requestOptions)
            .then(response => response.json())
            .then(json => MessageDto.fromJSON(json));
    }
}