import {assert} from 'chai';
import {describe, it} from 'mocha';
import {itCases} from './it-cases';

describe(itCases.name, () => {
    const genericItCasesOptions = {assert, it, forceIt: it.only, excludeIt: it.skip};

    itCases(
        genericItCasesOptions,
        () => {
            throw new Error();
        },
        [
            {
                throws: Error,
                it: 'should pass when an expected error is caught',
            },
        ],
    );
    itCases(genericItCasesOptions, () => {}, [
        {
            throws: undefined,
            it: 'should pass when no errors are thrown',
        },
    ]);

    itCases(
        genericItCasesOptions,
        () => {
            return true;
        },
        [
            {
                it: 'should pass',
                expect: true,
            },
            {
                it: 'should exclude this test',
                expect: false,
                exclude: true,
            },
        ],
    );
});
