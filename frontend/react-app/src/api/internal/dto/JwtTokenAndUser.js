import IndividualDtoShort from "./IndividualDtoShort";

export default class JwtTokenAndUser {
    constructor(token, user) {
        this.token = token;
        this.user = user;
    }

    static fromJSON(data) {
        new JwtTokenAndUser(
            data.token,
            IndividualDtoShort.fromJSON(data.user)
        )
    }
}