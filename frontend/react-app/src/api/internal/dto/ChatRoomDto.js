import IndividualDtoShort from "./IndividualDtoShort";
import MessageDto from "./MessageDto";
import PrivateChatDto from "./PrivateChatDto";

export default class ChatRoomDto {
    constructor(companion, messages, chat, unreadCount) {
        this.companion = IndividualDtoShort.fromJSON(companion);
        this.messages = messages.map(message => MessageDto.fromJSON(message));
        this.chat = PrivateChatDto.fromJSON(chat);
        this.unreadCount = unreadCount;
    }

    static fromJSON(data) {
        return new ChatRoomDto(
            data.companion,
            data.messages,
            data.chat,
            data.unreadCount
        );
    }
}
