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

    static parseOnlineDate(date) {
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

    static getDayAndMonth(prevMessage, currentMessage) {
        if (currentMessage) {
            const currentMessageDate = currentMessage.sentAt;
            if (!prevMessage || prevMessage.sentAt.toDateString() !== currentMessageDate.toDateString()) {
                const day = currentMessageDate.getDate();
                let dayAndMonth;
                switch (currentMessageDate.getMonth()) {
                    case 0:  dayAndMonth =  `${day} Января`; break;
                    case 1: dayAndMonth =  `${day} Февраля`; break;
                    case 2: dayAndMonth =  `${day} Марта`; break;
                    case 3: dayAndMonth =  `${day} Апреля`; break;
                    case 4: dayAndMonth =  `${day} Мая`; break;
                    case 5: dayAndMonth =  `${day} Июня`; break;
                    case 6: dayAndMonth =  `${day} Июля`; break;
                    case 7: dayAndMonth =  `${day} Августа`; break;
                    case 8: dayAndMonth =  `${day} Сентября`; break;
                    case 9: dayAndMonth =  `${day} Октября`; break;
                    case 10: dayAndMonth =  `${day} Ноября`; break;
                    case 11: dayAndMonth =  `${day} Декабря`; break;
                }
                return dayAndMonth;
            }
        }
    }
}