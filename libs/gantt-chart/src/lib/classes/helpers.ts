import * as moment from 'moment';

export class Helpers {

    /**
     * Generates scale dates
     *
     * @memberof AsterGantt
     */
    static generateDates(start, end) {
        let setProp = (obj, arr, val) => {
            if (typeof arr === 'string') {
                arr = arr.split('.');
            }

            if (arr.length > 1) {
                obj[arr[0]] = obj[arr[0]] || {};
                const tmpObj = obj[arr[0]];
                arr.shift();
                setProp(tmpObj, arr, val);
            } else {
                if (obj[arr[0]] === undefined) {
                    obj[arr[0]] = 0;
                }

                if (typeof obj[arr[0]] === 'object') {
                    obj[arr[0]] = obj[arr[0]].length === 0 ? 1 : val;
                } else {
                    if (val === 'Add') {
                        obj[arr[0]] += 1;
                    } else {
                        obj[arr[0]] = val;
                    }
                }
            }

            return obj;
        }

        moment.locale('pl', {
            week: {
                dow: 6,
                doy: 4
            }
        });

        const dates = {
            days: {},
            months: {},
            weeks: {},
            quarter: {},
            years: {},
            totalNoD: 0
        };

        let i = 0;
        while (moment(start).isSameOrBefore(end, 'day')) {
            dates.totalNoD++;

            const daysInYear = moment(start).isLeapYear() ? 366 : 365;
            const daysInMonth = moment(start).daysInMonth();
            const weeksInYear = moment(start).weeksInYear();
            const year = moment(start).format('YYYY');
            const quarter = moment(start).quarter();
            const month = moment(start).format('MMMM');
            const week = moment(start).format('WW');
            const day = moment(start).format('DDDD');

            setProp(dates, ['quarter', `${year}-${quarter}`, 'number'], 'Add');
            setProp(dates, ['quarter', `${year}-${quarter}`, 'name'], quarter);


            setProp(dates, ['years', year, 'number'], 'Add');
            setProp(dates, ['years', year, 'max'], daysInYear);

            setProp(
                dates,
                ['months', moment(start).format('YYYY-MM'), 'number'],
                'Add'
            );
            setProp(
                dates,
                ['months',
                    moment(start).format('YYYY-MM')
                    , 'name'],
                month
            );
            setProp(
                dates,
                ['months', moment(start).format('YYYY-MM'), 'max'],
                daysInMonth
            );

            if (parseInt(day, 10) > 363 && parseInt(week, 10) === 1) {
                /*

        Year have 52 weeks, so what when the the range of dates for 52 week of year is: 23 DEC - 30 DEC ?
        What with 31 DEC ??

        In this case 31 DEC is 1 week of next year, but MOMENTJS does not see this that way, that's why,
        we need manually add current day of month ( i.e 31 DEC ) as a 1 week of next year

        BAD:

        01 |     01
        31    1 2 3 4 5

        GOOD:

        01
        31 1 2 3 4 5

        */
                const nextYear = parseInt(moment(start).format('YYYY'), 10) + 1;
                setProp(
                    dates,
                    ['weeks', moment(start).format(nextYear + '-WW'), 'max'],
                    weeksInYear
                );

                const s = moment(start)
                    .day('Monday')
                    .week(parseInt(week, 10))
                    .locale('pl');

                const e = moment()
                    .day('Sunday')
                    .week(parseInt(week, 10) + 1)
                    .locale('pl');

                setProp(
                    dates,
                    ['weeks', moment(start).format(nextYear + '-WW'), 'name'],
                    moment(start).format('WW')
                );

                setProp(
                    dates,
                    ['weeks', moment(start).format(nextYear + '-WW'), 'number'],
                    'Add'
                );

                setProp(
                    dates,
                    [
                        'weeks',
                        moment(start).format(nextYear + '-WW'),
                        'dates',
                        moment(start).format('DD')
                    ],
                    moment(start).format('DD/MM/' + nextYear)
                );
            } else {
                setProp(
                    dates,
                    ['weeks', moment(start).format('YYYY-WW'), 'max'],
                    weeksInYear
                );

                const s = moment(start)
                    .day('Monday')
                    .week(parseInt(week, 10))
                    .locale('pl');

                const e = moment()
                    .day('Sunday')
                    .week(parseInt(week, 10) + 1)
                    .locale('pl');

                setProp(
                    dates,
                    ['weeks', moment(start).format('YYYY-WW'), 'name'],
                    moment(start).format('WW')
                );

                setProp(
                    dates,
                    ['weeks', moment(start).format('YYYY-WW'), 'number'],
                    'Add'
                );

                setProp(
                    dates,
                    [
                        'weeks',
                        moment(start).format('YYYY-WW'),
                        'dates',
                        moment(start).format('DD')
                    ],
                    moment(start).format('DD/MM/YYYY')
                );
            }

            setProp(dates, ['days', i], {
                date: moment(start).format('YYYY-MM-DD'),
                weekend: parseInt(moment(start).format('E'), 10) > 5,
                name: moment(start).format('DD')
            });
            i++;

            start = moment(start).add(1, 'd');
        }

        return dates;
    }
}