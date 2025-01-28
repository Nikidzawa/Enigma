import api from "../Api";

export default class UserApi {

    static authenticate(nicknameOrEmail, password) {
        return api.get(`/users/login?nicknameOrEmail=${nicknameOrEmail}&password=${password}`)
    }

    static emailIsUsed(email) {
        return api.get(`/users/existsBy?email=${email}`)
    }

    static save(userDto) {
        return api.post('/users/save', userDto)
    }
}