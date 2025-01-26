import {makeAutoObservable} from "mobx";
import CurrentUserController from "../../../../store/CurrentUserController";
import MailApi from "../../../../api/MailApi";


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
            email = CurrentUserController.getCurrentUser().email;
        }
        const response = await MailApi.sendAuthCode(email);
        console.log("send");
        if (response.ok) {
            const res = await response.text();
            console.log(res);
            return res;
        } else return null;
    }
}

export default new EmailCodeController();