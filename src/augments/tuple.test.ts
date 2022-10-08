import {assert} from 'chai';
import {describe} from 'mocha';
import {AtLeastTuple, isLengthAtLeast, Tuple} from './tuple';
import {DoesExtend, ExpectFalse, ExpectTrue} from './type-test';

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
        type maybeUndefined = ExpectTrue<DoesExtend<typeof access, undefined>>;

        if (isLengthAtLeast(anyArray, 2)) {
            const inGuardAccess = anyArray[1];
            type definitelyDefined = ExpectFalse<DoesExtend<typeof inGuardAccess, undefined>>;
            const stillMaybeUndefined = anyArray[10];
            type maybeUndefinedAgain = ExpectTrue<
                DoesExtend<typeof stillMaybeUndefined, undefined>
            >;
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
        type moreThanOneEntry = ExpectTrue<DoesExtend<AtLeastTuple<any, 5>, [1, 2, 3, 4, 5, 6, 7]>>;
    });
});
