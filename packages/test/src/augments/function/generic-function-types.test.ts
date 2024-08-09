import {assertTypeOf} from 'run-time-assertions';
import {describe} from '../universal-testing-suite/universal-describe.js';
import {it} from '../universal-testing-suite/universal-it.js';
import {TypedFunction} from './generic-function-types.js';

describe('TypedFunction', () => {
    it('properly assigns a single argument and a return type', () => {
        assertTypeOf<TypedFunction<string, number>>().toEqualTypeOf<(input: string) => number>();
        assertTypeOf<TypedFunction<undefined, number>>().toEqualTypeOf<
            (input: undefined) => number
        >();
        assertTypeOf<TypedFunction<[undefined | string], number>>().toEqualTypeOf<
            (input: undefined | string) => number
        >();

        const testAssignment: TypedFunction<[string?], number> = (input?: string | undefined) => 3;
    });
    it('properly assigns multiple arguments and a return type', () => {
        assertTypeOf<TypedFunction<[string, number], number>>().toEqualTypeOf<
            (input: string, input2: number) => number
        >();
        const testAssignment: TypedFunction<[string, number], number> = (
            input1: string,
            input2: number,
        ) => 5;
        assertTypeOf<TypedFunction<[string | void, number], number>>().toEqualTypeOf<
            (input: string | void, input2: number) => number
        >();
        assertTypeOf<TypedFunction<[string | undefined, number], number>>().toEqualTypeOf<
            (input: string | undefined, input2: number) => number
        >();
        assertTypeOf<TypedFunction<string[], number>>().toEqualTypeOf<
            (...inputs: string[]) => number
        >();
        assertTypeOf<TypedFunction<[string[]], number>>().toEqualTypeOf<
            (inputs: string[]) => number
        >();

        const testRestAssignment: TypedFunction<ReadonlyArray<string>, boolean> = (
            ...args: ReadonlyArray<string>
        ) => true;
    });
    it('properly assigns no arguments and a return type', () => {
        assertTypeOf<TypedFunction<void, number>>().toEqualTypeOf<() => number>();
    });
});
