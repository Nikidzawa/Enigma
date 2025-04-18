export default class IndividualDtoShort {
    constructor(id, nickname, name, surname, birthdate, aboutMe, avatarHref, lastLogoutDate) {
        this.id = id;
        this.nickname = nickname;
        this.name = name;
        this.surname = surname || '';
        this.birthdate = birthdate;
        this.aboutMe = aboutMe;
        this.avatarHref = avatarHref;
        this.lastLogoutDate = lastLogoutDate;
    }

    static fromJSON(data) {
        return new IndividualDtoShort(
            data.id,
            data.nickname,
            data.name,
            data.surname || '',
            data.birthdate,
            data.aboutMe,
            data.avatarHref,
            new Date(data.lastLogoutDate)
        );
    }
}