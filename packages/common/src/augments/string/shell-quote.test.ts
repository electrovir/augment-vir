import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {shellQuote} from './shell-quote.js';

describe(shellQuote.name, () => {
    itCases(shellQuote, [
        {
            it: 'quotes a plain value',
            input: 'plain',
            expect: "'plain'",
        },
        {
            it: 'contains spaces within a single argument',
            input: 'hello world',
            expect: "'hello world'",
        },
        {
            it: 'neutralizes command separators',
            input: '; rm -rf /',
            expect: "'; rm -rf /'",
        },
        {
            it: 'neutralizes command substitution',
            input: '$(echo substituted)',
            expect: "'$(echo substituted)'",
        },
        {
            it: 'preserves backslashes literally',
            input: String.raw`C:\dir\file`,
            expect: String.raw`'C:\dir\file'`,
        },
        {
            it: 'quotes an empty value so it survives as an argument',
            input: '',
            expect: "''",
        },
        {
            it: 'closes, escapes, and reopens for an embedded single quote',
            input: "it's",
            expect: String.raw`'it'\''s'`,
        },
    ]);

    it('has no unescaped single quotes left in its output', () => {
        assert.strictEquals(
            shellQuote("a'b'c")
                .slice(1, -1)
                .split(String.raw`'\''`)
                .join(''),
            'abc',
        );
    });
});
