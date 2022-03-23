import {randomString} from './node-string';

describe(randomString.name, () => {
    it('random string length is not required (has a default)', () => {
        expect(randomString()).toBeTruthy();
    });

    const length = 24;

    it('random string length matches specified length', () => {
        expect(randomString(length).length).toBe(length);
    });

    it('multiple calls to random string are not identical', () => {
        expect(randomString() === randomString()).toBe(false);
    });

    it('length works with odd numbers', () => {
        expect(randomString(3).length).toBe(3);
    });
});
