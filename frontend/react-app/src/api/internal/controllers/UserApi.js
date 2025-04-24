import api from "../Api";

export default class UserApi {

    static save(userDto) {
        return api.post('/users/save', userDto);
    }

    static edit(userDto) {
        return api.put('/users/edit', userDto);
    }

    static editNickname(userId, nickname) {
        return api.put(`/users/${userId}/edit/nickname?value=${nickname}`);
    }

    static authenticate(nicknameOrEmail, password) {
        return api.get(`/users/login?nicknameOrEmail=${nicknameOrEmail}&password=${password}`)
    }

    static emailIsUsed(email) {
        return api.get(`/users/existsByEmail?email=${email}`)
    }

    static getUserByToken(token) {
        return api.get(`/users/findByToken?token=${token}`);
    }

    static getUserById(userId) {
        return api.get(`/users/${userId}`)
    }

    static search(value, userId) {
        return api.get(`/users/search?value=${value}&userId=${userId}`);
    }

}