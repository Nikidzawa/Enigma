export default class IndividualDtoFull {
    constructor(id, nickname, name, surname, email, password, birthdate, aboutMe, avatarHref, lastLogoutDate) {
        this.id = id;
        this.nickname = nickname;
        this.name = name;
        this.surname = surname || '';
        this.email = email;
        this.password = password;
        this.birthdate = birthdate;
        this.aboutMe = aboutMe;
        this.avatarHref = avatarHref;
        this.lastLogoutDate = lastLogoutDate;
    }
}