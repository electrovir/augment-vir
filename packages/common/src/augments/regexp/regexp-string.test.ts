import {assert, describe} from '@augment-vir/test';
import {escapeStringForRegExp} from './regexp-string.js';

describe(escapeStringForRegExp.name, ({it}) => {
    it('should escape regexp characters', () => {
        assert.strictEqual(escapeStringForRegExp('[*.*]'), String.raw`\[\*\.\*\]`);
    });

    it('escaped text works as a RegExp', () => {
        const result = Array.from('[*.*]'.match(new RegExp(escapeStringForRegExp('[*.*]'))) || []);
        const expected = ['[*.*]'];
        assert.deepStrictEqual(result, expected);
    });
});
