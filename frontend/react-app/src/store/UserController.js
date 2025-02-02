import {makeAutoObservable} from "mobx";
import UserApi from "../api/controllers/UserApi";
import UserDto from "../api/dto/UserDto";


class UserController {

    currentUser = new UserDto();

    constructor() {
        makeAutoObservable(this);
    }

    setUser(user) {
        this.currentUser = user;
    }

    getCurrentUser() {
        return this.currentUser.id ? this.currentUser :
            UserApi.getUserByToken(localStorage.getItem("TOKEN"))
                .then(user => {
                    const userDto = UserDto.fromJSON(user.data);
                    this.setUser(userDto);
                    return userDto;
                })
                .catch(() => window.location.href = '/login');
    }
}

export default new UserController();