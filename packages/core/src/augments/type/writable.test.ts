import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type Writable} from './writable.js';

type Foo = {
    readonly a: number;
    readonly b: string;
};

describe('Writable', () => {
    it('removes readonly modifiers', () => {
        const ab: Writable<Foo> = {
            a: 1,
            b: '2',
        };
        ab.a = 2;
        const ab2: Writable<Readonly<Foo>> = ab;
        ab2.a = 2;

        assert.tsType(ab).equals<{a: number; b: string}>();
    });

    it('makes only the given keys writable', () => {
        assert
            .tsType<Writable<{readonly a: number; b: string; readonly c: boolean}, 'b' | 'c'>>()
            .equals<{readonly a: number; b: string; c: boolean}>();
    });

    it('leaves already-writable keys writable', () => {
        assert
            .tsType<Writable<{a: number; b: string; c: boolean}, 'a' | 'b' | 'c'>>()
            .equals<{a: number; b: string; c: boolean}>();
    });

    it('does not change value types', () => {
        assert
            .tsType<Writable<{readonly a: number; b: string; readonly c: boolean}, 'b' | 'c'>>()
            .notEquals<{readonly a: boolean; b: string; c: boolean}>();
    });

    it('makes arrays writable', () => {
        assert.tsType<Writable<readonly string[]>>().equals<string[]>();
    });

    it('makes tuples writable', () => {
        assert
            .tsType<
                Writable<
                    readonly [
                        string,
                        number,
                    ]
                >
            >()
            .equals<
                [
                    string,
                    number,
                ]
            >();
    });

    it('makes tuples with a spread writable', () => {
        assert
            .tsType<
                Writable<
                    readonly [
                        ...string[],
                        number,
                    ]
                >
            >()
            .equals<
                [
                    ...string[],
                    number,
                ]
            >();
        assert
            .tsType<
                Writable<
                    readonly [
                        string,
                        ...number[],
                    ]
                >
            >()
            .equals<
                [
                    string,
                    ...number[],
                ]
            >();
    });

    it('makes a readonly set writable', () => {
        assert.tsType<Writable<ReadonlySet<string>>>().equals<Set<string>>();
    });

    it('makes a readonly map writable', () => {
        assert.tsType<Writable<ReadonlyMap<string, number>>>().equals<Map<string, number>>();
    });
});
