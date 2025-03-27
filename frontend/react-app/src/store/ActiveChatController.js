import {makeAutoObservable} from "mobx";


class ActiveChatController {

    activeChat = null;

    constructor() {
        makeAutoObservable(this);
    }

    setChat(chat) {
        this.activeChat = chat;
    }

    getCurrentChat() {
        return this.activeChat;
    }
}

export default new ActiveChatController();