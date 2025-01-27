import BaseApiPath from "./BaseApiPath";

export default class MailApi extends BaseApiPath {
    static path = `${this.basePath}/mail`;

    static async sendAuthCode (mail) {
        const url = `${this.path}/sendAuthCode/${mail}`;
        const requestOptions = {
            method: 'POST',
        };
        return await fetch(url, requestOptions);
    }
}