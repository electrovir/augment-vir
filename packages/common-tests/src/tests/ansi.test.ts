import {expect} from 'chai';
import {describe, it} from 'mocha';
import {ansiRegex, safeMatch} from '../../../common/src';

describe('ansiRegex', () => {
    it('should match all ansi codes in a string', () => {
        const matches = safeMatch('hello\x1b[1m there\x1b[0m', ansiRegex);
        expect(matches).to.deep.equal([
            '\x1b[1m',
            '\x1b[0m',
        ]);
    });

    it('should not match anything when there are no ansi escape codes present', () => {
        expect(!!ansiRegex.exec('hello there')).to.equal(false);
    });
});
