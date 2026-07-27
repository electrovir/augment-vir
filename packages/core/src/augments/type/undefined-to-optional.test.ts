import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type UndefinedToOptional} from './undefined-to-optional.js';

describe('UndefinedToOptional', () => {
    it('makes properties that include undefined optional', () => {
        assert.tsType<UndefinedToOptional<{a: string; b: string | undefined}>>().equals<{
            a: string;
            b?: string;
        }>();
    });

    it('leaves fully defined objects unchanged', () => {
        assert.tsType<UndefinedToOptional<{a: string; b: number}>>().equals<{
            a: string;
            b: number;
        }>();
    });

    it('makes every undefined-including property optional', () => {
        assert
            .tsType<UndefinedToOptional<{a: string | undefined; b: number | undefined}>>()
            .equals<{
                a?: string;
                b?: number;
            }>();
    });

    it('strips undefined from the resulting optional value', () => {
        assert
            .tsType<UndefinedToOptional<{value: 'a' | 'b' | undefined}>>()
            .equals<{value?: 'a' | 'b'}>();
    });
});
