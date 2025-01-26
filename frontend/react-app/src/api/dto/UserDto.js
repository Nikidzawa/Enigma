export default class UserDto {
    constructor(id, nickname, name, surname, email, password) {
        this.id = id;
        this.nickname = nickname;
        this.name = name;
        this.surname = surname || null;
        this.email = email;
        this.password = password;
    }

    static fromJSON(data) {
        return new UserDto(
            data.id,
            data.nickname,
            data.name,
            data.surname || null,
            data.email,
            data.password,
        );
    }
}