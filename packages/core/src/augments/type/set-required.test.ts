import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type SetRequired} from './set-required.js';
import {type Simplify} from './simplify.js';

type Variation11 = SetRequired<
    {(a1: string, a2: number): boolean; p1?: string; readonly p2: number},
    'p1'
>;
type Variation12 = SetRequired<
    {(a1: boolean, ...a2: string[]): number; p1?: string; readonly p2?: number; p3?: boolean},
    'p1' | 'p2'
>;
type Variation13 = SetRequired<(a: string) => number, never>;

describe('SetRequired', () => {
    it('makes selected optional keys required', () => {
        assert
            .tsType<SetRequired<{a?: number; b: string; c?: boolean}, 'b' | 'c'>>()
            .equals<{a?: number; b: string; c: boolean}>();
        assert
            .tsType<SetRequired<{a?: number; b?: string; c?: boolean}, 'a' | 'b'>>()
            .equals<{a: number; b: string; c?: boolean}>();
    });

    it('leaves already-required keys required', () => {
        assert
            .tsType<SetRequired<{a: number; b: string; c: boolean}, 'a' | 'b' | 'c'>>()
            .equals<{a: number; b: string; c: boolean}>();
    });

    it('does not change value types', () => {
        assert
            .tsType<SetRequired<{a?: number; b: string; c?: boolean}, 'b' | 'c'>>()
            .notMatches<{a?: boolean; b: string; c: boolean}>();
    });

    it('distributes over unions', () => {
        assert
            .tsType<
                SetRequired<
                    {a?: '1'; b: string; c?: boolean} | {a?: '2'; b: string; c?: boolean},
                    'a' | 'b'
                >
            >()
            .equals<{a: '1'; b: string; c?: boolean} | {a: '2'; b: string; c?: boolean}>();
        assert
            .tsType<
                SetRequired<
                    | {readonly a?: number; b?: number; c?: boolean}
                    | {a?: string; readonly b?: string; d?: boolean},
                    'a' | 'b'
                >
            >()
            .equals<
                | {readonly a: number; b: number; c?: boolean}
                | {a: string; readonly b: string; d?: boolean}
            >();
    });

    it('preserves the readonly modifier', () => {
        assert
            .tsType<
                SetRequired<{readonly a?: number; readonly b: string; c?: boolean}, 'b' | 'c'>
            >()
            .equals<{readonly a?: number; readonly b: string; c: boolean}>();
    });

    it('makes all keys required when Keys is any', () => {
        assert
            .tsType<SetRequired<{readonly a?: number; b?: string; c?: boolean}, any>>()
            .equals<{readonly a: number; b: string; c: boolean}>();
    });

    it('does nothing when Keys is never', () => {
        assert
            .tsType<SetRequired<{a?: number; readonly b?: string; readonly c: boolean}, never>>()
            .equals<{a?: number; readonly b?: string; readonly c: boolean}>();
    });

    it('works with index signatures', () => {
        assert
            .tsType<SetRequired<{[k: string]: unknown; a?: number; b: string}, 'a' | 'b'>>()
            .equals<{[k: string]: unknown; a: number; b: string}>();
    });

    it('works with functions containing properties', () => {
        assert.tsType<ReturnType<Variation11>>().equals<boolean>();
        assert.tsType<Simplify<Variation11>>().equals<{p1: string; readonly p2: number}>();

        assert.tsType<ReturnType<Variation12>>().equals<number>();
        assert
            .tsType<Simplify<Variation12>>()
            .equals<{p1: string; readonly p2: number; p3?: boolean}>();
    });

    it('returns functions without properties as is', () => {
        assert.tsType<ReturnType<Variation13>>().equals<number>();
    });

    it('works with empty arrays', () => {
        assert.tsType<SetRequired<[], never>>().equals<[]>();
        assert.tsType<SetRequired<readonly [], never>>().equals<readonly []>();
    });

    it('makes leading optional elements required', () => {
        assert
            .tsType<
                SetRequired<
                    [
                        string?,
                        number?,
                    ],
                    '0'
                >
            >()
            .equals<
                [
                    string,
                    number?,
                ]
            >();
        assert
            .tsType<
                SetRequired<
                    [
                        string?,
                        number?,
                        boolean?,
                    ],
                    '0' | '1' | '2'
                >
            >()
            .equals<
                [
                    string,
                    number,
                    boolean,
                ]
            >();
    });

    it('works with number, string, and mixed Keys', () => {
        assert
            .tsType<
                SetRequired<
                    [
                        string,
                        number?,
                        boolean?,
                    ],
                    1
                >
            >()
            .equals<
                [
                    string,
                    number,
                    boolean?,
                ]
            >();
        assert
            .tsType<
                SetRequired<
                    [
                        string,
                        number?,
                        boolean?,
                        ...number[],
                    ],
                    '1' | '2'
                >
            >()
            .equals<
                [
                    string,
                    number,
                    boolean,
                    ...number[],
                ]
            >();
        assert
            .tsType<
                SetRequired<
                    readonly [
                        string?,
                        number?,
                        boolean?,
                    ],
                    '0' | 1 | 2
                >
            >()
            .equals<
                readonly [
                    string,
                    number,
                    boolean,
                ]
            >();
    });

    it('works with readonly arrays', () => {
        assert
            .tsType<SetRequired<readonly [(string | number)?], '0'>>()
            .equals<readonly [string | number]>();
        assert
            .tsType<
                SetRequired<
                    readonly [
                        string,
                        number?,
                        boolean?,
                    ],
                    '1'
                >
            >()
            .equals<
                readonly [
                    string,
                    number,
                    boolean?,
                ]
            >();
    });

    it('ignores Keys that are already required', () => {
        assert
            .tsType<
                SetRequired<
                    [
                        string,
                        number?,
                        boolean?,
                    ],
                    '0'
                >
            >()
            .equals<
                [
                    string,
                    number?,
                    boolean?,
                ]
            >();
        assert
            .tsType<
                SetRequired<
                    readonly [
                        string,
                        number,
                        boolean,
                    ],
                    1 | 2
                >
            >()
            .equals<
                readonly [
                    string,
                    number,
                    boolean,
                ]
            >();
    });

    it('ignores Keys that are out of bounds', () => {
        assert.tsType<SetRequired<[], 1>>().equals<[]>();
        assert
            .tsType<
                SetRequired<
                    [
                        string,
                        number?,
                        boolean?,
                    ],
                    10
                >
            >()
            .equals<
                [
                    string,
                    number?,
                    boolean?,
                ]
            >();
        assert
            .tsType<
                SetRequired<
                    [
                        string?,
                        number?,
                        boolean?,
                    ],
                    0 | 1 | 2 | 3 | 4
                >
            >()
            .equals<
                [
                    string,
                    number,
                    boolean,
                ]
            >();
    });

    it('makes all elements required when Keys is any or number', () => {
        assert
            .tsType<
                SetRequired<
                    [
                        string?,
                        number?,
                        boolean?,
                    ],
                    any
                >
            >()
            .equals<
                [
                    string,
                    number,
                    boolean,
                ]
            >();
        assert
            .tsType<
                SetRequired<
                    [
                        string?,
                        number?,
                        boolean?,
                    ],
                    number
                >
            >()
            .equals<
                [
                    string,
                    number,
                    boolean,
                ]
            >();
        assert
            .tsType<
                SetRequired<
                    [
                        string,
                        number?,
                        boolean?,
                        ...number[],
                    ],
                    number
                >
            >()
            .equals<
                [
                    string,
                    number,
                    boolean,
                    ...number[],
                ]
            >();
    });

    it('returns the array as is when Keys is never', () => {
        assert
            .tsType<
                SetRequired<
                    [
                        string?,
                        number?,
                    ],
                    never
                >
            >()
            .equals<
                [
                    string?,
                    number?,
                ]
            >();
        assert
            .tsType<
                SetRequired<
                    readonly [
                        string?,
                        number?,
                        ...number[],
                    ],
                    never
                >
            >()
            .equals<
                readonly [
                    string?,
                    number?,
                    ...number[],
                ]
            >();
    });

    it('preserves the undefined type on elements', () => {
        assert
            .tsType<
                SetRequired<
                    [
                        string | undefined,
                        (number | undefined)?,
                        boolean?,
                    ],
                    0 | 1 | 2
                >
            >()
            .equals<
                [
                    string | undefined,
                    number | undefined,
                    boolean,
                ]
            >();
    });

    it('ignores Keys that would place optional elements after required ones', () => {
        assert
            .tsType<
                SetRequired<
                    [
                        string?,
                        number?,
                        boolean?,
                    ],
                    1 | 2
                >
            >()
            .equals<
                [
                    string?,
                    number?,
                    boolean?,
                ]
            >();
    });

    it('works with unions of arrays', () => {
        assert.tsType<SetRequired<readonly [] | [], never>>().equals<readonly [] | []>();
        assert
            .tsType<SetRequired<[] | readonly [(string | number)?], 0>>()
            .equals<[] | readonly [string | number]>();
    });

    it('works with labelled tuples', () => {
        assert
            .tsType<
                SetRequired<
                    [
                        x?: string,
                        y?: number,
                    ],
                    '0' | '1'
                >
            >()
            .equals<
                [
                    x: string,
                    y: number,
                ]
            >();
    });

    it('leaves non-tuple arrays unchanged', () => {
        assert.tsType<SetRequired<string[], number>>().equals<string[]>();
        assert
            .tsType<SetRequired<ReadonlyArray<string | number>, number>>()
            .equals<ReadonlyArray<string | number>>();
        assert.tsType<SetRequired<[...number[]], never>>().equals<number[]>();
    });
});
