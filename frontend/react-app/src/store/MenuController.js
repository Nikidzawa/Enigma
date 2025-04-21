import {makeAutoObservable} from "mobx";

class MenuController {

    isOpen = false;

    constructor() {
        makeAutoObservable(this);
    }

    setMenuVisible(value) {
        this.isOpen = value;
    }

    menuIsVisible() {
        return this.isOpen;
    }
}

export default new MenuController();