import {makeAutoObservable} from "mobx";

class ActiveChat {

    activeChat = null;

    constructor() {
        makeAutoObservable(this);
    }

    setActiveChat (activeChat) {
        this.activeChat = activeChat;
    }

    getActiveChat() {
        return this.activeChat;
    }
}

export default new ActiveChat();