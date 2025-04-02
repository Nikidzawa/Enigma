export default class DateParser {
    static parseToWeekDay(date) {
        const days = [
            'ВC',
            'ПН',
            'ВТ',
            'СР',
            'ЧТ',
            'ПТ',
            'СБ'
        ];
        const n = date.getDay();
        return days[n];
    }

    static parseToHourAndMinute(date) {
        return `${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
    }

    static parseDate(createdAt) {
        const now = new Date();
        if (`${now.getFullYear()} ${now.getMonth()} ${now.getDate()}` === `${createdAt.getFullYear()} ${createdAt.getMonth()} ${createdAt.getDate()}`) {
            return this.parseToHourAndMinute(createdAt);
        } else return this.parseToWeekDay(createdAt);
    }


    static parseToDateAndTime(createdAt) {
        const now = new Date();
        if (`${now.getFullYear()} ${now.getMonth()} ${now.getDate()}` === `${createdAt.getFullYear()} ${createdAt.getMonth()} ${createdAt.getDate()}`) {
            return this.parseToHourAndMinute(createdAt);
        } else return createdAt.getDate()
    }
}