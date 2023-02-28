import {assertTypeOf} from '@augment-vir/chai';
import {expect} from 'chai';
import {describe, it} from 'mocha';
import {isTruthy} from '../../../common/src';
import {TypedFunction} from '../../../common/src/augments/function';

describe(isTruthy.name, () => {
    it('should return true for various truthy things', () => {
        const stuffToTest: any[] = [
            'stuff',
            5,
            [],
            {},
        ];

        expect(stuffToTest.every(isTruthy)).to.equal(true);
    });

    it('should filter out null types', () => {
        const stuffToTest: (string | undefined)[] = [
            'stuff',
            undefined,
            'derp',
        ];

        const onlyStrings: string[] = stuffToTest.filter(isTruthy);

        expect(onlyStrings).to.deep.equal([
            'stuff',
            'derp',
        ]);
    });

    it('should fail on falsy things', () => {
        const stuffToTest: any[] = [
            undefined,
            false,
            0,
            '',
            null,
            NaN,
        ];

        expect(stuffToTest.some(isTruthy)).to.equal(false);
    });
});

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
