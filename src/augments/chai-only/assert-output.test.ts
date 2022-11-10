import {describe} from 'mocha';
import {itCases} from './assert-output';

describe(itCases.name, () => {
    itCases(() => {
        throw new Error();
    }, [
        {
            throws: Error,
            it: 'should pass when an expected error is caught',
        },
    ]);
    itCases(() => {}, [
        {
            throws: undefined,
            it: 'should pass when no errors are thrown',
        },
    ]);
});
