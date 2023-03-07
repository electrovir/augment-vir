import {itCases} from '@augment-vir/chai';
import {calculateRelativeDate} from '../../../../common/src';

describe(calculateRelativeDate.name, () => {
    /** ISO string of this date is "2009-02-13T23:31:30.123Z" */
    const startDate = new Date(1234567890123);

    itCases(
        (calculations: Parameters<typeof calculateRelativeDate>[1]) => {
            const relativeDate = calculateRelativeDate(startDate, calculations);

            return relativeDate.toISOString();
        },
        [
            {
                it: 'makes no change when no calculations are given',
                input: {},
                expect: '2009-02-13T23:31:30.123Z',
            },

            {
                it: 'uses all calculations at once',
                input: {
                    milliseconds: 10,
                    seconds: 10,
                    minutes: 10,
                    hours: 10,
                    days: 10,
                    months: 10,
                    years: 10,
                },
                expect: '2019-12-24T09:41:40.133Z',
            },

            {
                it: 'increases milliseconds',
                input: {milliseconds: 100},
                expect: '2009-02-13T23:31:30.223Z',
            },
            {
                it: 'decreases milliseconds',
                input: {milliseconds: -100},
                expect: '2009-02-13T23:31:30.023Z',
            },
            {
                it: 'increases milliseconds across second boundaries',
                input: {milliseconds: 12_345},
                expect: '2009-02-13T23:31:42.468Z',
            },
            {
                it: 'decreases milliseconds across second boundaries',
                input: {milliseconds: -12_345},
                expect: '2009-02-13T23:31:17.778Z',
            },

            {
                it: 'increases seconds',
                input: {seconds: 10},
                expect: '2009-02-13T23:31:40.123Z',
            },
            {
                it: 'decreases seconds',
                input: {seconds: -10},
                expect: '2009-02-13T23:31:20.123Z',
            },
            {
                it: 'increases seconds across boundaries',
                input: {seconds: 1_000},
                expect: '2009-02-13T23:48:10.123Z',
            },
            {
                it: 'decreases seconds across boundaries',
                input: {seconds: -1_000},
                expect: '2009-02-13T23:14:50.123Z',
            },

            {
                it: 'increases minutes',
                input: {minutes: 10},
                expect: '2009-02-13T23:41:30.123Z',
            },
            {
                it: 'decreases minutes',
                input: {minutes: -10},
                expect: '2009-02-13T23:21:30.123Z',
            },
            {
                it: 'increases minutes across boundaries',
                input: {minutes: 100},
                expect: '2009-02-14T01:11:30.123Z',
            },
            {
                it: 'decreases minutes across boundaries',
                input: {minutes: -100},
                expect: '2009-02-13T21:51:30.123Z',
            },

            {
                it: 'decreases hours',
                input: {hours: -10},
                expect: '2009-02-13T13:31:30.123Z',
            },
            {
                it: 'increases hours across boundaries',
                input: {hours: 10},
                expect: '2009-02-14T09:31:30.123Z',
            },
            {
                it: 'decreases hours across boundaries',
                input: {hours: -50},
                expect: '2009-02-11T21:31:30.123Z',
            },

            {
                it: 'increases days',
                input: {days: 10},
                expect: '2009-02-23T23:31:30.123Z',
            },
            {
                it: 'decreases days',
                input: {days: -10},
                expect: '2009-02-03T23:31:30.123Z',
            },
            {
                it: 'increases days across boundaries',
                input: {days: 28},
                expect: '2009-03-13T23:31:30.123Z',
            },
            {
                it: 'decreases days across boundaries',
                input: {days: -31},
                expect: '2009-01-13T23:31:30.123Z',
            },

            {
                it: 'increases months',
                input: {months: 1},
                expect: '2009-03-13T23:31:30.123Z',
            },
            {
                it: 'decreases months',
                input: {months: -1},
                expect: '2009-01-13T23:31:30.123Z',
            },
            {
                it: 'increases months across boundaries',
                input: {months: 15},
                expect: '2010-05-13T23:31:30.123Z',
            },
            {
                it: 'decreases months across boundaries',
                input: {months: -15},
                expect: '2007-11-13T23:31:30.123Z',
            },

            {
                it: 'increases years',
                input: {years: 1},
                expect: '2010-02-13T23:31:30.123Z',
            },
            {
                it: 'decreases years',
                input: {years: -1},
                expect: '2008-02-13T23:31:30.123Z',
            },
            {
                it: 'increases years across boundaries',
                input: {years: 1_000},
                expect: '3009-02-13T23:31:30.123Z',
            },
            {
                it: 'decreases years across boundaries',
                input: {years: -1_000},
                expect: '1009-02-13T23:31:30.123Z',
            },
        ],
    );
});
