import {assert} from '@augment-vir/assert';
import {describe, it} from 'node:test';
import {TypedFunction} from './generic-function-type.js';

describe('TypedFunction', () => {
    it('properly assigns a single argument and a return type', () => {
        assert.typeOf<TypedFunction<string, number>>().toEqualTypeOf<(input: string) => number>();
        assert
            .typeOf<TypedFunction<undefined, number>>()
            .toEqualTypeOf<(input: undefined) => number>();
        assert
            .typeOf<TypedFunction<[undefined | string], number>>()
            .toEqualTypeOf<(input: undefined | string) => number>();

        const testAssignment: TypedFunction<[string?], number> = (input?: string | undefined) => 3;
    });
    it('properly assigns multiple arguments and a return type', () => {
        assert
            .typeOf<TypedFunction<[string, number], number>>()
            .toEqualTypeOf<(input: string, input2: number) => number>();
        const testAssignment: TypedFunction<[string, number], number> = (
            input1: string,
            input2: number,
        ) => 5;
        assert
            .typeOf<TypedFunction<[string | void, number], number>>()
            .toEqualTypeOf<(input: string | void, input2: number) => number>();
        assert
            .typeOf<TypedFunction<[string | undefined, number], number>>()
            .toEqualTypeOf<(input: string | undefined, input2: number) => number>();
        assert
            .typeOf<TypedFunction<string[], number>>()
            .toEqualTypeOf<(...inputs: string[]) => number>();
        assert
            .typeOf<TypedFunction<[string[]], number>>()
            .toEqualTypeOf<(inputs: string[]) => number>();

        const testRestAssignment: TypedFunction<ReadonlyArray<string>, boolean> = (
            ...args: ReadonlyArray<string>
        ) => true;
    });
    it('properly assigns no arguments and a return type', () => {
        assert.typeOf<TypedFunction<void, number>>().toEqualTypeOf<() => number>();
    });
});
