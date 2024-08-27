import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {ensureError, ensureErrorAndPrependMessage} from './ensure-error.js';

describe(ensureError.name, () => {
    it('converts into an error', () => {
        const error = ensureError('not an error');
        assert.instanceOf(error, Error);
        assert.strictEquals(error.message, 'not an error');
    });
    it('passes through an error', () => {
        const error = new Error('this is an error');
        const ensuredError = ensureError(error);
        assert.strictEquals(error, ensuredError);
    });
});

describe(ensureErrorAndPrependMessage.name, () => {
    it('prepends a message', () => {
        const error = new Error('1');
        const prependedError = ensureErrorAndPrependMessage(error, '2');

        assert.strictEquals(prependedError.message, '2: 1');
        assert.strictEquals(
            prependedError.stack,
            error.stack,
            'the error stack should not get modified',
        );
        assert.strictEquals(prependedError, error, 'should not create a new error');
    });
});
