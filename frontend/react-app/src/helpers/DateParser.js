export default class DateParser {
    static parseToWeerDay (date) {
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

    static parseToHourAndMinute (date) {
        return `${date.getHours()}:${date.getMinutes()}`;
    }
}