import {assert} from 'chai';
import {describe, it} from 'mocha';
import {itCases} from './it-cases';

describe(itCases.name, () => {
    itCases(
        {assert, it, forceIt: it.only},
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
    itCases({assert, it, forceIt: it.only}, () => {}, [
        {
            throws: undefined,
            it: 'should pass when no errors are thrown',
        },
    ]);
});
