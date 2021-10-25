import {testGroup} from 'test-vir';
import {
    createDateFromNamedCommaFormat,
    createDateFromSlashFormat,
    createDateFromUtcIsoFormat,
    englishFullMonthNames,
    englishShortMonthNames,
    InvalidDateError,
} from './date';

testGroup({
    description: createDateFromSlashFormat.name,
    tests: (runTest) => {
        runTest({
            description: 'creates date from valid slash formatted input',
            expect: '2000-01-01T00:00:00.000Z',
            test: () => createDateFromSlashFormat('01/01/2000').toISOString(),
        });
        runTest({
            description: 'handles lack of year',
            expect: '0000-01-01T00:00:00.000Z',
            test: () => createDateFromSlashFormat('01/01').toISOString(),
        });
        runTest({
            description: 'handles lack of year with short year prefix',
            expect: '0200-01-01T00:00:00.000Z',
            test: () => createDateFromSlashFormat('01/01', 2).toISOString(),
        });
        runTest({
            description: 'handles lack of year with full year prefix',
            expect: '2000-01-01T00:00:00.000Z',
            test: () => createDateFromSlashFormat('01/01', 20).toISOString(),
        });
        runTest({
            description: 'handles year with full prefix',
            expect: '2020-01-01T00:00:00.000Z',
            test: () => createDateFromSlashFormat('01/01/20', 20).toISOString(),
        });
        runTest({
            description: 'handles year with partial prefix',
            expect: '0220-01-01T00:00:00.000Z',
            test: () => createDateFromSlashFormat('01/01/20', 2).toISOString(),
        });
        runTest({
            description: 'handles year with no prefix',
            expect: '0020-01-01T00:00:00.000Z',
            test: () => createDateFromSlashFormat('01/01/20').toISOString(),
        });
    },
});

testGroup({
    description: createDateFromUtcIsoFormat.name,
    tests: (runTest) => {
        runTest({
            description: 'creates date from valid iso formatted string',
            expect: '2020-02-20T00:00:00.000Z',
            test: () => createDateFromUtcIsoFormat('2020-02-20').toISOString(),
        });
        runTest({
            description: 'errors on invalid string input',
            expectError: {
                errorClass: InvalidDateError,
            },
            test: () => createDateFromUtcIsoFormat('nothing to see here').toISOString(),
        });
    },
});

testGroup({
    description: 'englishFullMonthNames',
    tests: (runTest) => {
        runTest({
            description: 'sanity check that full month names contain 12 months',
            expect: 12,
            test: () => englishFullMonthNames.length,
        });
    },
});

testGroup({
    description: 'englishShortMonthNames',
    tests: (runTest) => {
        runTest({
            description: 'sanity check that short month names contain 12 months',
            expect: 12,
            test: () => englishShortMonthNames.length,
        });
    },
});

testGroup({
    description: createDateFromNamedCommaFormat.name,
    tests: (runTest) => {
        runTest({
            description: 'errors on invalid string format',
            expectError: {
                errorClass: InvalidDateError,
            },
            test: () => createDateFromNamedCommaFormat('2020-02-20').toISOString(),
        });

        runTest({
            description: 'works on validly formatted inputs',
            expect: '2019-08-17T00:00:00.000Z',
            test: () => createDateFromNamedCommaFormat('Aug 17, 2019').toISOString(),
        });

        runTest({
            description: 'works on the beginning of the year',
            expect: '2017-01-01T00:00:00.000Z',
            test: () => createDateFromNamedCommaFormat('Jan 1, 2017').toISOString(),
        });

        runTest({
            description: 'works on the end of the year',
            expect: '2017-12-31T00:00:00.000Z',
            test: () => createDateFromNamedCommaFormat('Dec 31, 2017').toISOString(),
        });

        runTest({
            description: 'works with lowercase month',
            expect: '2017-12-31T00:00:00.000Z',
            test: () => createDateFromNamedCommaFormat('dec 31, 2017').toISOString(),
        });
    },
});
