import {makeAutoObservable} from "mobx";


class CurrentUserController {

    currentUser = null;

    constructor() {
        makeAutoObservable(this);
    }

    setUser(user) {
        this.currentUser = user;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

export default new CurrentUserController();