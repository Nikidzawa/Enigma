import MessageDto from "./MessageDto";

export default class ChatRoomDto {
    constructor(userId, userName, userSurname, lastMessage, chatId, isGroupChat, chatName) {
        this.userId = userId;
        this.userName = userName;
        this.userSurname = userSurname;
        this.lastMessage = lastMessage;
        this.chatId = chatId;
        this.isGroupChat = isGroupChat;
        this.chatName = chatName;
    }

    static fromJSON(data) {
        return new ChatRoomDto(
            data.userId,
            data.userName,
            data.userSurname,
            MessageDto.fromJSON(data.lastMessage),
            data.chatId,
            data.isGroupChat,
            data.chatName
        );
    }
}
