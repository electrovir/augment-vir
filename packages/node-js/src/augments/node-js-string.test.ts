import {expect} from 'chai';
import {describe, it} from 'mocha';
import {randomString} from './node-js-string';

describe(randomString.name, () => {
    it('random string length is not required (has a default)', () => {
        expect(!!randomString()).to.equal(true);
    });

    const length = 24;

    it('random string length matches specified length', () => {
        expect(randomString(length).length).to.equal(length);
    });

    it('multiple calls to random string are not identical', () => {
        expect(randomString() === randomString()).to.equal(false);
    });

    it('length works with odd numbers', () => {
        expect(randomString(3).length).to.equal(3);
    });
});
