import {makeAutoObservable} from "mobx";


class ChatsController {

    chats = [];

    constructor() {
        makeAutoObservable(this);
    }

    setChats(chats) {
        this.chats = chats || chats;
    }

    getChats() {
        return this.chats;
    }
}

export default new ChatsController();