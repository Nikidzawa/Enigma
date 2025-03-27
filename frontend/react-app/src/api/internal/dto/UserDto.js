export default class UserDto {
    constructor(id, nickname, name, surname, email, password, avatarHref) {
        this.id = id;
        this.nickname = nickname;
        this.name = name;
        this.surname = surname || '';
        this.email = email;
        this.password = password;
        this.avatarHref = avatarHref;
    }

    static fromJSON(data) {
        return new UserDto(
            data.id,
            data.nickname,
            data.name,
            data.surname || '',
            data.email,
            data.password,
            data.avatarHref
        );
    }
}