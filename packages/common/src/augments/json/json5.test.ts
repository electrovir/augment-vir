import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {parseWithJson5, stringifyWithJson5} from './json5.js';

describe(parseWithJson5.name, () => {
    it('it parses normal JSON', () => {
        const mockValue = {
            a: 'b',
            c: 'd',
        };
        assert.deepEquals(parseWithJson5(JSON.stringify(mockValue)), mockValue);
    });
    it('it parses JSON 5', () => {
        const mockValue = {
            a: 'b',
            c: 'd',
        };
        assert.deepEquals(parseWithJson5(stringifyWithJson5(mockValue)), mockValue);
        assert.deepEquals(parseWithJson5("{a: 'b', c:'d'}"), mockValue);
    });
});

describe(stringifyWithJson5.name, () => {
    it('it stringifies objects', () => {
        assert.strictEquals(stringifyWithJson5({a: 'b', c: 'd'}), "{a:'b',c:'d'}");
    });
});
