import BaseApiPath from "./BaseApiPath";

export default class UserApi extends BaseApiPath {
    static path = `${this.basePath}/users`

    static authenticate(username, password) {
        const url = `${this.path}/login?username=${username}&password=${password}`;
        return fetch(url)
    }

    static save(userDto) {
        const url = `${this.path}/save`
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userDto)
        };
        return fetch(url, requestOptions)
    }
}