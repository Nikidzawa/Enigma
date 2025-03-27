import MessageDto from "./MessageDto";
import UserDtoShort from "./UserDtoShort";

export default class ChatRoomDto {
    constructor(companion, lastMessage, chat) {
        this.companion = UserDtoShort.fromJSON(companion);
        this.lastMessage = lastMessage && MessageDto.fromJSON(lastMessage);
        this.chat = chat;
    }

    static fromJSON(data) {
        return new ChatRoomDto(
            data.companion,
            data.lastMessage,
            data.chat
        );
    }
}
