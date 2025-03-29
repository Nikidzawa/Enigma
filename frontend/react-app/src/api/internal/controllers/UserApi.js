import api from "../Api";

export default class UserApi {

    static authenticate(nicknameOrEmail, password) {
        return api.get(`/users/login?nicknameOrEmail=${nicknameOrEmail}&password=${password}`)
    }

    static emailIsUsed(email) {
        return api.get(`/users/existsBy?email=${email}`)
    }

    static nicknameIsUsed(nickname, userId) {
        return api.get(`/users/existsByNickname?nickname=${nickname}&userId=${userId}`)
    }

    static getUserByToken(token) {
        return api.get(`users/findBy?token=${token}`);
    }

    static getUserById(userId) {
        return api.get(`users/${userId}`)
    }

    static search(value, userId) {
        return api.get(`/users/search?value=${value}&userId=${userId}`);
    }

    static save(userDto) {
        return api.post('/users/save', userDto);
    }

    static edit(userDto) {
        return api.put('/users/edit', userDto);
    }
}