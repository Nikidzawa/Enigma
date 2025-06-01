import {makeAutoObservable} from "mobx";

class ActiveChatInputController {

    text = ''

    constructor() {
        makeAutoObservable(this);
    }

    setText(text) {
        this.text = text;
    }

    getText() {
        return this.text;
    }
}

export default new ActiveChatInputController();