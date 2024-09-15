import {describe, it} from '@augment-vir/test';
import {assert} from '../augments/guards/assert.js';
import {type AssertFunction} from './assert-function.js';

describe('AssertFunction', () => {
    it('asserts', () => {
        const assertFunction: AssertFunction<string> = () => {
            // do nothing
        };

        const value = 'a' as any;

        assert.tsType(value).equals<any>();
        assertFunction(value);
        assert.tsType(value).equals<string>();
    });
});
