export default class StringUtils {

    static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    static replaceSpaces (string) {
        return string.replace(/\s+/g, "");
    }

    static isEmail (string) {
        return this.emailRegex.test(string);
    }
}