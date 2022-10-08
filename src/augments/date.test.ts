import {expect} from 'chai';
import {describe, it} from 'mocha';
import {
    createDateFromNamedCommaFormat,
    createDateFromSlashFormat,
    createDateFromUtcIsoFormat,
    englishFullMonthNames,
    englishShortMonthNames,
    InvalidDateError,
} from './date';

describe(createDateFromSlashFormat.name, () => {
    it('creates date from valid slash formatted input', () => {
        expect(createDateFromSlashFormat('01/01/2000').toISOString()).to.equal(
            '2000-01-01T00:00:00.000Z',
        );
    });
    it('handles lack of year', () => {
        expect(createDateFromSlashFormat('01/01').toISOString()).to.equal(
            '0000-01-01T00:00:00.000Z',
        );
    });
    it('handles lack of year with short year prefix', () => {
        expect(createDateFromSlashFormat('01/01', 2).toISOString()).to.equal(
            '0200-01-01T00:00:00.000Z',
        );
    });
    it('handles lack of year with full year prefix', () => {
        expect(createDateFromSlashFormat('01/01', 20).toISOString()).to.equal(
            '2000-01-01T00:00:00.000Z',
        );
    });
    it('handles year with full prefix', () => {
        expect(createDateFromSlashFormat('01/01/20', 20).toISOString()).to.equal(
            '2020-01-01T00:00:00.000Z',
        );
    });
    it('handles year with partial prefix', () => {
        expect(createDateFromSlashFormat('01/01/20', 2).toISOString()).to.equal(
            '0220-01-01T00:00:00.000Z',
        );
    });
    it('handles year with no prefix', () => {
        expect(createDateFromSlashFormat('01/01/20').toISOString()).to.equal(
            '0020-01-01T00:00:00.000Z',
        );
    });
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
    it('errors on invalid string format', () => {
        expect(() => createDateFromNamedCommaFormat('2020-02-20')).to.throw(InvalidDateError);
    });

    it('works on validly formatted inputs', () => {
        expect(createDateFromNamedCommaFormat('Aug 17, 2019').toISOString()).to.equal(
            '2019-08-17T00:00:00.000Z',
        );
    });

    it('works on the beginning of the year', () => {
        expect(createDateFromNamedCommaFormat('Jan 1, 2017').toISOString()).to.equal(
            '2017-01-01T00:00:00.000Z',
        );
    });

    it('works on the end of the year', () => {
        expect(createDateFromNamedCommaFormat('Dec 31, 2017').toISOString()).to.equal(
            '2017-12-31T00:00:00.000Z',
        );
    });

    it('works with lowercase month', () => {
        expect(createDateFromNamedCommaFormat('dec 31, 2017').toISOString()).to.equal(
            '2017-12-31T00:00:00.000Z',
        );
    });
});
