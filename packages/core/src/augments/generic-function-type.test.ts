import {assert} from '@augment-vir/assert';
import {describe, it} from 'node:test';
import {TypedFunction} from './generic-function-type.js';

describe('TypedFunction', () => {
    it('properly assigns a single argument and a return type', () => {
        assert.tsType<TypedFunction<string, number>>().equals<(input: string) => number>();
        assert.tsType<TypedFunction<undefined, number>>().equals<(input: undefined) => number>();
        assert
            .tsType<TypedFunction<[undefined | string], number>>()
            .equals<(input: undefined | string) => number>();

        const testAssignment: TypedFunction<[string?], number> = (input?: string | undefined) => 3;
    });
    it('properly assigns multiple arguments and a return type', () => {
        assert
            .tsType<TypedFunction<[string, number], number>>()
            .equals<(input: string, input2: number) => number>();
        const testAssignment: TypedFunction<[string, number], number> = (
            input1: string,
            input2: number,
        ) => 5;
        assert
            .tsType<TypedFunction<[string | void, number], number>>()
            .equals<(input: string | void, input2: number) => number>();
        assert
            .tsType<TypedFunction<[string | undefined, number], number>>()
            .equals<(input: string | undefined, input2: number) => number>();
        assert.tsType<TypedFunction<string[], number>>().equals<(...inputs: string[]) => number>();
        assert.tsType<TypedFunction<[string[]], number>>().equals<(inputs: string[]) => number>();

        const testRestAssignment: TypedFunction<ReadonlyArray<string>, boolean> = (
            ...args: ReadonlyArray<string>
        ) => true;
    });
    it('properly assigns no arguments and a return type', () => {
        assert.tsType<TypedFunction<void, number>>().equals<() => number>();
    });
});
