import {describe, it} from '@augment-vir/test';
import {assertTypeOf} from 'run-time-assertions';
import {MappedTuple} from './tuple.js';

describe('MappedTuple', () => {
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
