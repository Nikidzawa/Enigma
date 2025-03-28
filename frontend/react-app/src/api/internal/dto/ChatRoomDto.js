import UserDtoShort from "./UserDtoShort";
import MessageDto from "./MessageDto";

export default class ChatRoomDto {
    constructor(companion, messages, chat) {
        this.companion = UserDtoShort.fromJSON(companion);
        this.messages = messages.map(message => MessageDto.fromJSON(message));
        this.chat = chat;
    }

    static fromJSON(data) {
        return new ChatRoomDto(
            data.companion,
            data.messages,
            data.chat
        );
    }
}
