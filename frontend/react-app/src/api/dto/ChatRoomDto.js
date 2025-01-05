import MessageDto from "./MessageDto";

export default class ChatRoomDto {
    constructor(userId, userName, userSurname, lastMessage, chatId) {
        this.userId = userId;
        this.userName = userName;
        this.userSurname = userSurname;
        this.lastMessage = lastMessage;
        this.chatId = chatId;
    }

    static fromJSON(data) {
        return new ChatRoomDto(
            data.userId,
            data.userName,
            data.userSurname ? data.userSurname : "",
            data.lastMessage && MessageDto.fromJSON(data.lastMessage),
            data.chatId
        );
    }
}
