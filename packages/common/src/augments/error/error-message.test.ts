import {assert, describe, extractErrorMessage, it} from '@augment-vir/test';

describe(extractErrorMessage.name, () => {
    it('should extract message from error object', () => {
        assert.strictEqual(extractErrorMessage(new Error('hello there')), 'hello there');
    });

    it('should return empty string for falsy inputs', () => {
        assert.strictEqual(extractErrorMessage(undefined), '');
        assert.strictEqual(extractErrorMessage(null), '');
        assert.strictEqual(extractErrorMessage(false), '');
    });

    it('should return a string for other inputs', () => {
        assert.strictEqual(extractErrorMessage(54_621), '54621');
    });

    it('should return a string for strings', () => {
        assert.strictEqual(extractErrorMessage('just a string'), 'just a string');
    });
});
