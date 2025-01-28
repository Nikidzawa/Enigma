import api from "../Api";

export default class MailApi {

    static async sendAuthCode (mail) {
        return api.post(`/mail/sendAuthCode/${mail}`)
    }
}