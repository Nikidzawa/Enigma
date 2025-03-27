export default class UserDtoShort {
    constructor(id, nickname, name, surname, avatarHref) {
        this.id = id;
        this.nickname = nickname;
        this.name = name;
        this.surname = surname || '';
        this.avatarHref = avatarHref;
    }

    static fromJSON(data) {
        return new UserDtoShort(
            data.id,
            data.nickname,
            data.name,
            data.surname || '',
            data.avatarHref
        );
    }
}