import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {mergeDefinedProperties} from './merge-defiend-properties.js';

describe(mergeDefinedProperties.name, () => {
    it('merges objects', () => {
        const result = mergeDefinedProperties({a: 'b', c: 'd', e: 'f'}, {a: undefined}, {c: 'q'});
        assert.deepEquals(result, {
            a: 'b',
            c: 'q',
            e: 'f',
        });
    });
});
