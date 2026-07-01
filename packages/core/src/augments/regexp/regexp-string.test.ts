import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {escapeStringForRegExp} from './regexp-string.js';

describe(escapeStringForRegExp.name, () => {
    it('escapes regexp characters', () => {
        assert.strictEquals(escapeStringForRegExp('[*.*]'), String.raw`\[\*\.\*\]`);
    });

    it('escaped text works as a RegExp', () => {
        const result = Array.from('[*.*]'.match(new RegExp(escapeStringForRegExp('[*.*]'))) || []);
        const expected = ['[*.*]'];
        assert.deepEquals(result, expected);
    });
});
