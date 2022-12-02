import {itCases} from '@augment-vir/testing';
import {assert, expect} from 'chai';
import {describe, it} from 'mocha';
import {
    createDateFromNamedCommaFormat,
    createDateFromSlashFormat,
    createDateFromUtcIsoFormat,
    englishFullMonthNames,
    englishShortMonthNames,
    InvalidDateError,
} from '../../../common/src';

describe(createDateFromSlashFormat.name, () => {
    itCases(
        assert,
        (...args: Parameters<typeof createDateFromSlashFormat>) =>
            createDateFromSlashFormat(...args).toISOString(),
        [
            {
                it: 'should create date from valid slash formatted input',
                expect: '2000-01-01T00:00:00.000Z',
                inputs: ['01/01/2000'],
            },
            {
                it: 'should handle lack of year',
                expect: '0000-01-01T00:00:00.000Z',
                inputs: ['01/01'],
            },
            {
                it: 'should error on invalid input',
                throws: 'Unable to extract month or day',
                inputs: ['0101'],
            },
            {
                it: 'should handle lack of year with short year prefix',
                expect: '0200-01-01T00:00:00.000Z',
                inputs: [
                    '01/01',
                    2,
                ],
            },
            {
                it: 'handles lack of year with full year prefix',
                expect: '2000-01-01T00:00:00.000Z',
                inputs: [
                    '01/01',
                    20,
                ],
            },
            {
                it: 'handles year with full prefix',
                expect: '2020-01-01T00:00:00.000Z',
                inputs: [
                    '01/01/20',
                    20,
                ],
            },
            {
                it: 'handles year with partial prefix',
                expect: '0220-01-01T00:00:00.000Z',
                inputs: [
                    '01/01/20',
                    2,
                ],
            },
            {
                it: 'handles year with no prefix',
                expect: '0020-01-01T00:00:00.000Z',
                inputs: ['01/01/20'],
            },
        ],
    );
});

describe(createDateFromUtcIsoFormat.name, () => {
    it('creates date from valid iso formatted string', () => {
        expect(createDateFromUtcIsoFormat('2020-02-20').toISOString()).to.equal(
            '2020-02-20T00:00:00.000Z',
        );
    });
    it('errors on invalid string input', () => {
        expect(() => createDateFromUtcIsoFormat('nothing to see here')).to.throw(InvalidDateError);
    });
});

describe('englishFullMonthNames', () => {
    it('sanity check that full month names contain 12 months', () => {
        expect(englishFullMonthNames.length).to.equal(12);
    });
});

describe('englishShortMonthNames', () => {
    it('sanity check that short month names contain 12 months', () => {
        expect(englishShortMonthNames.length).to.equal(12);
    });
});

describe(createDateFromNamedCommaFormat.name, () => {
    itCases(
        assert,
        (...args: Parameters<typeof createDateFromNamedCommaFormat>) =>
            createDateFromNamedCommaFormat(...args).toISOString(),
        [
            {
                it: 'should error on invalid string format',
                inputs: ['2020-02-20'],
                throws: InvalidDateError,
            },
            {
                it: 'should error on invalid month name',
                inputs: ['Blah 17, 2019'],
                throws: InvalidDateError,
            },
            {
                it: 'should use current month if ignoreInvalidMonth is true',
                inputs: [
                    'Blah 17, 2019',
                    true,
                ],
                expect: `2019-${String(new Date().getUTCMonth() + 1).padStart(
                    2,
                    '0',
                )}-17T00:00:00.000Z`,
            },
            {
                it: 'should work with long month name',
                inputs: [
                    'March 17, 2019',
                ],
                expect: '2019-03-17T00:00:00.000Z',
            },
            {
                it: 'should work on validly formatted inputs',
                inputs: ['Aug 17, 2019'],
                expect: '2019-08-17T00:00:00.000Z',
            },

            {
                it: 'should work on the beginning of the year',
                inputs: ['Jan 1, 2017'],
                expect: '2017-01-01T00:00:00.000Z',
            },

            {
                it: 'should work on the end of the year',
                inputs: ['Dec 31, 2017'],
                expect: '2017-12-31T00:00:00.000Z',
            },

            {
                it: 'should work with lowercase month',
                inputs: ['dec 31, 2017'],
                expect: '2017-12-31T00:00:00.000Z',
            },
        ],
    );
});
