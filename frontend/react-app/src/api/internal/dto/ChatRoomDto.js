import IndividualDtoShort from "./IndividualDtoShort";
import MessageDto from "./MessageDto";
import PrivateChatDto from "./PrivateChatDto";

export default class ChatRoomDto {
    constructor(companion, messages, chat, unreadCount) {
        this.companion = companion;
        this.messages = messages;
        this.chat = chat;
        this.unreadCount = unreadCount;

        this.firstLoadMessages = true;
    }

    static fromJSON(data) {
        return new ChatRoomDto(
            IndividualDtoShort.fromJSON(data.companion),
            [MessageDto.fromJSON(data.lastMessage)],
            PrivateChatDto.fromJSON(data.chat),
            data.unreadCount
        );
    }
}
