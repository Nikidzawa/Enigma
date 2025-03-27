import {makeAutoObservable} from "mobx";
import UserController from "../../../../store/UserController";
import MailApi from "../../../../api/internal/controllers/MailApi";


class EmailCodeController {

    emailCode = null;
    email = null;

    constructor() {
        makeAutoObservable(this);
    }

    setEmailCode(emailCode) {
        this.emailCode = emailCode;
    }

    getEmailCode() {
        return this.emailCode;
    }

    setEmail(email) {
        this.email = email;
    }

    getEmail() {
        return this.email;
    }

    sendAuthCode (email) {
        try {
            return MailApi.sendAuthCode(email);
        } catch (error) {
            return null;
        }
    }
}

export default new EmailCodeController();