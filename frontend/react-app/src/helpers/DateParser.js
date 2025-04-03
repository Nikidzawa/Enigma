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

    static pad = num => num < 10 ? '0' + num : num;

    static parseToHourAndMinute(date) {
        return `${date.getHours()}:${this.pad(date.getMinutes())}`;
    }

    static parseDate(createdAt) {
        const now = new Date();
        if (`${now.getFullYear()} ${now.getMonth()} ${now.getDate()}` === `${createdAt.getFullYear()} ${createdAt.getMonth()} ${createdAt.getDate()}`) {
            return this.parseToHourAndMinute(createdAt);
        } else return this.parseToWeekDay(createdAt);
    }

    static parseOnlineDate(isOnline, date) {
        if (isOnline) {return 'В сети'}
        let lastOnlineStr = 'Был(а) '

        const now = new Date();

        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (yesterday.toDateString() === date.toDateString()) {
            return `${lastOnlineStr} вчера в ${this.parseToHourAndMinute(date)}`;
        } else if (now.toDateString() === date.toDateString()) {
            return `${lastOnlineStr} сегодня в ${this.parseToHourAndMinute(date)}`;
        } else {
            return `${lastOnlineStr} ${date.getFullYear()}.${this.pad(date.getMonth() + 1)}.${this.pad(date.getDate())} в ${this.parseToHourAndMinute(date)}`;
        }
    }
}