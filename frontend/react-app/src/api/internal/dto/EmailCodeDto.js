export default class EmailCodeDto {
    constructor(code, email) {
        this.code = code;
        this.email = email;
    }

    static fromJSON(data) {
        return new EmailCodeDto(
            data.code,
            data.email
        )
    }
}