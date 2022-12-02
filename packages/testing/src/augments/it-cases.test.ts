import {assert} from 'chai';
import {describe} from 'mocha';
import {itCases} from './it-cases';

describe(itCases.name, () => {
    itCases(
        assert,
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
    itCases(assert, () => {}, [
        {
            throws: undefined,
            it: 'should pass when no errors are thrown',
        },
    ]);
});
