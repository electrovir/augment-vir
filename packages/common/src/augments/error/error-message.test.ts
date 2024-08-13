import {assert, describe, extractErrorMessage, it} from '@augment-vir/test';

describe(extractErrorMessage.name, () => {
    it('should extract message from error object', () => {
        assert.areStrictEqual(extractErrorMessage(new Error('hello there')), 'hello there');
    });

    it('should return empty string for falsy inputs', () => {
        assert.areStrictEqual(extractErrorMessage(undefined), '');
        assert.areStrictEqual(extractErrorMessage(null), '');
        assert.areStrictEqual(extractErrorMessage(false), '');
    });

    it('should return a string for other inputs', () => {
        assert.areStrictEqual(extractErrorMessage(54_621), '54621');
    });

    it('should return a string for strings', () => {
        assert.areStrictEqual(extractErrorMessage('just a string'), 'just a string');
    });
});
