import {makeAutoObservable} from "mobx";
import UserController from "../../../../store/UserController";
import MailApi from "../../../../api/controllers/MailApi";


class EmailCodeController {

    emailCode = null;

    constructor() {
        makeAutoObservable(this);
    }

    setEmailCode(emailCode) {
        this.emailCode = emailCode;
    }

    getEmailCode() {
        return this.emailCode;
    }

    async sendAuthCode (email) {
        if (!email) {
            email = UserController.getCurrentUser().email;
        }
        try {
            const response = await MailApi.sendAuthCode(email);
            return response.data;
        } catch (error) {
            return null;
        }
    }
}

export default new EmailCodeController();