export default class UserDtoShort {
    constructor(id, nickname, name, surname, birthdate, aboutMe, avatarHref) {
        this.id = id;
        this.nickname = nickname;
        this.name = name;
        this.surname = surname || '';
        this.birthdate = birthdate;
        this.aboutMe = aboutMe;
        this.avatarHref = avatarHref;
        this.isOnline = false;
    }

    static fromJSON(data) {
        return new UserDtoShort(
            data.id,
            data.nickname,
            data.name,
            data.surname || '',
            data.birthdate,
            data.aboutMe,
            data.avatarHref
        );
    }
}