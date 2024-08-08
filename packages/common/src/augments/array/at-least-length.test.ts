import {assert, describe} from '@augment-vir/test';
import {assertTypeOf} from 'run-time-assertions';
import {assertLengthAtLeast, isLengthAtLeast} from './at-least-length.js';

describe(isLengthAtLeast.name, ({it}) => {
    it('checks length', () => {
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

    it('guards types', () => {
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

    it('has undefined entries after the asserted length', () => {
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

describe(assertLengthAtLeast.name, ({it, itCases}) => {
    it('is a type guard', () => {
        const anyArray: string[] = [
            'a',
            'b',
            'c',
        ];
        const access = anyArray[0];
        assertTypeOf(access).toBeNullable();
        assertLengthAtLeast(anyArray, 2);

        const inGuardAccess = anyArray[1];
        assertTypeOf(inGuardAccess).not.toBeNullable();
        const stillMaybeUndefined = anyArray[10];

        assertTypeOf(stillMaybeUndefined).toBeNullable();
    });

    itCases(assertLengthAtLeast, [
        {
            it: 'works on a sufficiently sized array',
            inputs: [
                [''],
                1,
            ],
            throws: undefined,
        },
        {
            it: 'fails on an insufficiently sized array',
            inputs: [
                [''],
                2,
            ],
            throws: {matchConstructor: Error},
        },
    ]);
});
