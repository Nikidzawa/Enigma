import {makeAutoObservable} from "mobx";
import UserApi from "../api/internal/controllers/UserApi";
import IndividualDtoFull from "../api/internal/dto/IndividualDtoFull";
import IndividualDtoShort from "../api/internal/dto/IndividualDtoShort";


class UserController {

    currentUser = new IndividualDtoFull();

    constructor() {
        makeAutoObservable(this);
    }

    setUser(user) {
        this.currentUser = user;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    async fetchUserByToken() {
        try {
            const response = await UserApi.getUserByToken(localStorage.getItem("TOKEN"));
            return IndividualDtoShort.fromJSON(response.data);
        } catch {
            console.error("Ошибка получения пользователя, обновите токен");
            window.location.href = '/login';
        }
    }

}

export default new UserController();