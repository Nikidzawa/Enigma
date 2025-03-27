import {makeAutoObservable} from "mobx";
import UserApi from "../api/internal/controllers/UserApi";
import UserDto from "../api/internal/dto/UserDto";


class UserController {

    currentUser = new UserDto();

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
            return UserDto.fromJSON(response.data);
        } catch {
            console.error("Ошибка получения пользователя, обновите токен");
            window.location.href = '/login';
        }
    }

}

export default new UserController();