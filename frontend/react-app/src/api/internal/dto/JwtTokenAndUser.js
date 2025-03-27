import UserDto from "./UserDto";

export default class JwtTokenAndUser {
    constructor(token, user) {
        this.token = token;
        this.user = user;
    }

    static fromJSON(data) {
        new JwtTokenAndUser(
            data.token,
            UserDto.fromJSON(data.user)
        )
    }
}