import BaseApiPath from "./BaseApiPath";
import MessageDto from "./dto/MessageDto";
import ChatRoomDto from "./dto/ChatRoomDto";

export default class MessagesApi extends BaseApiPath {
    static path = `${this.basePath}/messages`

    static async getMessagesByChatId(chatId) {
        const url = `${this.path}/getByChatId/${chatId}?lastMessageId=0`;
        const response = await fetch(url);
        const json = await response.json();
        return json.map(data => MessageDto.fromJSON(data));
    }

    static async save(message) {
        const url = `${this.path}/new`;
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