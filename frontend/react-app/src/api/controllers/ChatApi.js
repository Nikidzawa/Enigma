import BaseApiPath from "../ProtectedApi";
import ChatRoomDto from "../dto/ChatRoomDto";

export default class ChatApi extends BaseApiPath {
    static path = `${this.protectedApi}/chats`;

    static async getAllUserChatsByUserId(userId) {
        const url = `${this.path}/getAllUserChats/${userId}`;
        const response = await fetch(url);
        const json = await response.json();
        return await json.map(data => ChatRoomDto.fromJSON(data));
    }
}