import {assert} from '@augment-vir/assert';
import {type AnyFunction} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {deepCopy, type CustomCopy, type DeepCopyOptions} from 'deepcopy-esm';

describe(deepCopy.name, () => {
    it('copies', () => {
        const value = {
            a: () => {},
        };
        assert.deepEquals(value, deepCopy(value));
    });
    it('includes types', () => {
        assert.tsType<CustomCopy>().matches<AnyFunction>();
        assert.tsType<DeepCopyOptions>().equals<{customizer?: CustomCopy}>();
    });
});
