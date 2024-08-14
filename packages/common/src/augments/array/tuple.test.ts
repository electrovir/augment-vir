import {describe, it} from '@augment-vir/test';
import {assert} from 'run-time-assertions';
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

        assert
            .tsType<MappedMyArray>()
            .equals<Readonly<[RegExp, RegExp, RegExp, RegExp, RegExp, RegExp]>>();
        assert
            .tsType<MappedMyArray>()
            .notEquals<Readonly<[RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp]>>();
        assert
            .tsType<MappedMyArray>()
            .notEquals<Readonly<[RegExp, RegExp, RegExp, RegExp, RegExp]>>();
        assert.tsType<MappedMyArray>().notEquals<ReadonlyArray<RegExp>>();
    });
});
