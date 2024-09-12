import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {copyThroughJson} from '../json/copy-through-json.js';
import {mergeDefinedProperties} from './merge-defined-properties.js';

describe(mergeDefinedProperties.name, () => {
    it('merges objects', () => {
        const original = {a: 'b', c: 'd', e: 'f'};
        const originalCopy = copyThroughJson(original);

        const result = mergeDefinedProperties(original, {a: undefined}, {c: 'q'});
        assert.deepEquals(result, {
            a: 'b',
            c: 'q',
            e: 'f',
        });

        assert.deepEquals(original, originalCopy, 'should not have mutated the original object');
    });
    itCases(mergeDefinedProperties, [
        {
            it: 'handles undefined',
            inputs: [
                {a: 'b'},
                undefined,
            ],
            expect: {a: 'b'},
        },
    ]);
});
