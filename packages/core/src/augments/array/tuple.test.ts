import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type MappedTuple, type Tuple, type TupleIndexes} from './tuple.js';

describe('Tuple', () => {
    it('has proper types', () => {
        assert
            .tsType<
                [
                    string,
                    string,
                ]
            >()
            .equals<Tuple<string, 2>>();
        assert
            .tsType<
                [
                    'a',
                    'b',
                ]
            >()
            .notEquals<Tuple<string, 2>>();
    });
    it('builds a precise tuple for single-digit sizes', () => {
        assert.tsType<Tuple<string, 6>['length']>().equals<6>();
        assert.tsType<Tuple<string, 0>['length']>().equals<0>();
    });
    it('builds a precise tuple just below the bail-out threshold', () => {
        assert.tsType<Tuple<string, 99>['length']>().equals<99>();
    });
    it('falls back to a plain array for literal sizes >= 100', () => {
        assert.tsType<Tuple<string, 100>>().equals<string[]>();
        assert.tsType<Tuple<string, 1000>>().equals<string[]>();
    });
    it('falls back to a plain array for an unknown numeric size', () => {
        assert.tsType<Tuple<string, number>>().equals<string[]>();
    });
    it('falls back to a plain array for negative literal sizes', () => {
        assert.tsType<Tuple<string, -1>>().equals<string[]>();
        assert.tsType<Tuple<string, -100>>().equals<string[]>();
    });
    it('falls back to a plain array for non-integer literal sizes', () => {
        assert.tsType<Tuple<string, 1.5>>().equals<string[]>();
    });
    it('falls back to a plain array for scientific-notation literal sizes', () => {
        assert.tsType<Tuple<string, 1e21>>().equals<string[]>();
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

        assert.tsType<MappedMyArray>().equals<
            Readonly<
                [
                    RegExp,
                    RegExp,
                    RegExp,
                    RegExp,
                    RegExp,
                    RegExp,
                ]
            >
        >();
        assert.tsType<MappedMyArray>().notEquals<
            Readonly<
                [
                    RegExp,
                    RegExp,
                    RegExp,
                    RegExp,
                    RegExp,
                    RegExp,
                    RegExp,
                ]
            >
        >();
        assert.tsType<MappedMyArray>().notEquals<
            Readonly<
                [
                    RegExp,
                    RegExp,
                    RegExp,
                    RegExp,
                    RegExp,
                ]
            >
        >();
        assert.tsType<MappedMyArray>().notEquals<ReadonlyArray<RegExp>>();
    });
});

describe('TupleIndexes', () => {
    it('extracts from a tuple', () => {
        assert
            .tsType<
                TupleIndexes<
                    [
                        'a',
                        'b',
                        'c',
                    ]
                >
            >()
            .equals<0 | 1 | 2>();
    });
    it('fails on a non-tuple', () => {
        assert.tsType<TupleIndexes<[]>>().equals<never>();
    });
});
