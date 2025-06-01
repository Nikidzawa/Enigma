export default class DateParser {

    static dayOfWeekShort = ['ВC', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
    static monthOfYearFull = [`Января`, `Февраля`,  `Марта`, `Апреля`, `Мая`, `Июня`, `Июля`, `Августа`, `Сентября`, `Октября`, `Ноября`,  `Декабря`];
    static pad = num => num < 10 ? '0' + num : num;

    static getDayOfWeekShort(date) {
        return this.dayOfWeekShort[date.getDay()];
    }

    static getDayAndMonth(currentDate) {
        const day = currentDate.getDate();
        let month = this.monthOfYearFull[currentDate.getMonth()];
        return `${day} ${month}`;
    }

    static parseToHourAndMinute(date) {
        return `${date.getHours()}:${this.pad(date.getMinutes())}`;
    }

    static parseDate(createdAt) {
        const now = new Date();
        if (`${now.getFullYear()} ${now.getMonth()} ${now.getDate()}` === `${createdAt.getFullYear()} ${createdAt.getMonth()} ${createdAt.getDate()}`) {
            return this.parseToHourAndMinute(createdAt);
        } else return this.getDayOfWeekShort(createdAt);
    }

    static parseOnlineDate(date) {
        let lastOnlineStr = 'Был(а) '

        const now = new Date();

        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (yesterday.toDateString() === date.toDateString()) {
            return `${lastOnlineStr} вчера в ${this.parseToHourAndMinute(date)}`;
        } else if (now.toDateString() === date.toDateString()) {
            return `${lastOnlineStr} сегодня в ${this.parseToHourAndMinute(date)}`;
        } else if (now.getFullYear() > date.getFullYear()) {
            return `${lastOnlineStr} ${date.getFullYear()}.${this.pad(date.getMonth() + 1)}.${this.pad(date.getDate())} в ${this.parseToHourAndMinute(date)}`;
        } else {
            return `${lastOnlineStr} ${this.getDayAndMonth(date)} в ${this.parseToHourAndMinute(date)}`;
        }
    }
}