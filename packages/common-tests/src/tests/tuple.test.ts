import {assertTypeOf} from '@augment-vir/chai';
import {assert} from 'chai';
import {describe} from 'mocha';
import {AtLeastTuple, isLengthAtLeast, Tuple} from '../../../common/src';

describe(isLengthAtLeast.name, () => {
    it('should check length', () => {
        assert.isTrue(
            isLengthAtLeast(
                [
                    'a',
                    'b',
                    'c',
                    'd',
                    'e',
                ],
                5,
            ),
        );
        assert.isFalse(
            isLengthAtLeast(
                [
                    'a',
                    'b',
                    'c',
                    'd',
                    'e',
                ],
                7,
            ),
        );
    });

    it('should guard types', () => {
        const anyArray: string[] = [
            'a',
            'b',
            'c',
        ];
        const access = anyArray[0];
        assertTypeOf(access).toBeNullable();

        if (isLengthAtLeast(anyArray, 2)) {
            const inGuardAccess = anyArray[1];
            assertTypeOf(inGuardAccess).not.toBeNullable();
            const stillMaybeUndefined = anyArray[10];

            assertTypeOf(stillMaybeUndefined).toBeNullable();
        }
    });

    it('should still have undefined indexes after the asserted length', () => {
        const myArray = [1];
        if (isLengthAtLeast(myArray, 2)) {
            assertTypeOf(myArray[2]).toEqualTypeOf<number | undefined>();
            const [
                first,
                second,
                third,
            ] = myArray;
            assertTypeOf(first).toEqualTypeOf<number>();
            assertTypeOf(second).toEqualTypeOf<number>();
            assertTypeOf(third).toEqualTypeOf<number | undefined>();
        }
    });
});

describe('AtLeastTuple', () => {
    it('should be assignable to from a Tuple', () => {
        const atLeastTuple: AtLeastTuple<any, 5> = [
            1,
            2,
            3,
            4,
            5,
        ] as Tuple<any, 5>;
    });
    it('should not be assignable to a Tuple', () => {
        // @ts-expect-error
        const strictTuple: Tuple<any, 5> = [
            1,
            2,
            3,
            4,
            5,
        ] as AtLeastTuple<any, 5>;
    });

    it('should match arrays with more than the expected length', () => {
        assertTypeOf([
            1,
            2,
            3,
            4,
            5,
            6,
            7,
        ] as const).toBeAssignableTo<AtLeastTuple<any, 5>>();
        assertTypeOf([
            1,
            2,
            3,
        ] as const).not.toBeAssignableTo<AtLeastTuple<any, 5>>();
    });
});
