import BaseApiPath from "./BaseApiPath";

export default class UserApi extends BaseApiPath {
    static path = `${this.basePath}/users`

    static getUserById (userId) {
        const url = `${this.path}/${userId}`
        return fetch(url);
    }

    static authenticate(username, password) {
        const url = `${this.path}/login?username=${username}&password=${password}`;
        return fetch(url)
    }
}