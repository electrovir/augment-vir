import {assert, describe} from '@augment-vir/test';
import {ansiRegExp, removeAnsiEscapeCodes, removeColor} from './ansi.js';
import {safeMatch} from './safe-match.js';

describe('ansiRegex', ({it}) => {
    it('should match all ansi codes in a string', () => {
        const matches = safeMatch('hello\x1b[1m there\x1b[0m', ansiRegExp);
        assert.deepStrictEqual(matches, [
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
    describe(removeAnsiFunction.name, ({it}) => {
        it('should remove all ansi escape codes', () => {
            assert.strictEqual(removeAnsiFunction('hello\x1b[1m there\x1b[0m'), 'hello there');
        });

        it('should not remove anything when there are no escape codes', () => {
            assert.strictEqual(removeAnsiFunction('hello there'), 'hello there');
        });
    });
});
