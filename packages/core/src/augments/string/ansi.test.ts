import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {ansiRegExp, removeAnsiEscapeCodes, removeColor} from './ansi.js';

describe('ansiRegExp', () => {
    it('should match all ansi codes in a string', () => {
        const matches = 'hello\x1b[1m there\x1b[0m'.match(ansiRegExp);
        assert.deepEquals(matches, [
            '\x1b[1m',
            '\x1b[0m',
        ]);
    });

    it('should not match anything when there are no ansi escape codes present', () => {
        assert.isFalse(!!ansiRegExp.exec('hello there'));
    });
});

const removeAnsiFunctions = [
    removeColor,
    removeAnsiEscapeCodes,
];

removeAnsiFunctions.forEach((removeAnsiFunction) => {
    describe(removeAnsiFunction.name, () => {
        it('should remove all ansi escape codes', () => {
            assert.strictEquals(removeAnsiFunction('hello\x1b[1m there\x1b[0m'), 'hello there');
        });

        it('should not remove anything when there are no escape codes', () => {
            assert.strictEquals(removeAnsiFunction('hello there'), 'hello there');
        });
    });
});
