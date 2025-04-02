export default class UserDto {
    constructor(id, nickname, name, surname, email, password, birthdate, aboutMe, avatarHref, lastOnline) {
        this.id = id;
        this.nickname = nickname;
        this.name = name;
        this.surname = surname || '';
        this.email = email;
        this.password = password;
        this.birthdate = birthdate;
        this.aboutMe = aboutMe;
        this.avatarHref = avatarHref;
        this.isOnline = false;
        this.lastOnline = lastOnline;
    }

    static fromJSON(data) {
        return new UserDto(
            data.id,
            data.nickname,
            data.name,
            data.surname || '',
            data.email,
            data.password,
            data.birthdate,
            data.aboutMe,
            data.avatarHref,
            new Date(`${data.lastOnline}`)
        );
    }
}