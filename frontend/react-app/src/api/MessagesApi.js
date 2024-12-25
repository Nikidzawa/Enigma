import BaseApiPath from "./BaseApiPath";
import MessageDto from "./dto/MessageDto";

export default class MessagesApi extends BaseApiPath {
    static path = `${this.basePath}/messages`

    static async getMessagesByChatIdAndLastMessageId(chatId, lastMessageId) {
        const url = `${this.path}/${chatId}?lastMessageId=${lastMessageId}`;
        return await fetch(url);
    }

    static async getMessagesByChatId(chatId) {
        const url = `${this.path}/getByChatId/${chatId}?lastMessageId=0`;
        const response = await fetch(url);
        const json = await response.json();
        return json.map(data => MessageDto.fromJSON(data));
    }
}