import {describe} from '@augment-vir/test';
import {assertTypeOf} from 'run-time-assertions';
import {AtLeastTuple, MappedTuple, Tuple} from './tuple.js';

describe('AtLeastTuple', ({it}) => {
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
        // @ts-expect-error: `AtLeastTuple` can be bigger than `Tuple`
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

describe('MappedTuple', ({it}) => {
    it('has proper types', () => {
        const myArray = [
            1,
            2,
            3,
            4,
            'a',
            'b',
        ] as const;
        type MappedMyArray = MappedTuple<typeof myArray, RegExp>;

        assertTypeOf<MappedMyArray>().toEqualTypeOf<
            Readonly<[RegExp, RegExp, RegExp, RegExp, RegExp, RegExp]>
        >();
        assertTypeOf<MappedMyArray>().not.toEqualTypeOf<
            Readonly<[RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp]>
        >();
        assertTypeOf<MappedMyArray>().not.toEqualTypeOf<
            Readonly<[RegExp, RegExp, RegExp, RegExp, RegExp]>
        >();
        assertTypeOf<MappedMyArray>().not.toEqualTypeOf<ReadonlyArray<RegExp>>();
    });
});
