import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type MappedTuple, type Tuple, type TupleIndexes} from './tuple.js';

describe('Tuple', () => {
    it('has proper types', () => {
        assert.tsType<[string, string]>().equals<Tuple<string, 2>>();
        assert.tsType<['a', 'b']>().notEquals<Tuple<string, 2>>();
    });
});

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

describe('TupleIndexes', () => {
    it('extracts from a tuple', () => {
        assert.tsType<TupleIndexes<['a', 'b', 'c']>>().equals<0 | 1 | 2>();
    });
    it('fails on a non-tuple', () => {
        assert.tsType<TupleIndexes<[]>>().equals<never>();
    });
});
