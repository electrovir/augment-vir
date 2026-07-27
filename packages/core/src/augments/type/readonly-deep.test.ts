import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type ReadonlyDeep} from './readonly-deep.js';

type Overloaded = {
    (foo: number): string;
    (foo: string, bar: number): number;
};

type Namespace = {
    (foo: number): string;
    baz: boolean[];
};

type NamespaceWithOverload = Overloaded & {
    baz: boolean[];
};

class ClassA {
    public foo = 1;
}

type Data = {
    object: {foo: string};
    constructor: typeof ClassA;
    fn: (input: string) => boolean;
    fnWithOverload: Overloaded;
    namespace: Namespace;
    namespaceWithOverload: NamespaceWithOverload;
    string: string;
    number: number;
    boolean: boolean;
    symbol: symbol;
    date: Date;
    regExp: RegExp;
    null: null;
    undefined: undefined;
    map: Map<string, string>;
    set: Set<string>;
    array: string[];
    emptyTuple: [];
    singleItemTuple: ['foo'];
    multiItemTuple: [
        {a: string},
        {b: number},
        {c: string},
    ];
    trailingSpreadTuple: [
        string,
        ...number[],
    ];
    leadingSpreadTuple: [
        ...string[],
        number,
    ];
    readonlyMap: ReadonlyMap<string, string>;
    readonlySet: ReadonlySet<string>;
    readonlyArray: readonly string[];
    readonlyTuple: readonly ['foo'];
};

type ReadonlyData = ReadonlyDeep<Data>;

type VoidType = {
    foo: void;
    bar: string | void;
};
type VoidTypeExpected = {
    readonly foo: void;
    readonly bar: string | void;
};

type ReadonlyNamespace = ReadonlyDeep<{(foo: number): string; baz: boolean[]}>;

describe('ReadonlyDeep', () => {
    it('makes top-level properties readonly', () => {
        assert.tsType<ReadonlyDeep<{a: number}>>().equals<{readonly a: number}>();
    });

    it('leaves constructors and plain functions unchanged', () => {
        assert.tsType<ReadonlyData['constructor']>().equals<typeof ClassA>();
        assert.tsType<ReadonlyData['fn']>().equals<(input: string) => boolean>();
        assert.tsType<ReadonlyData['fnWithOverload']>().equals<Overloaded>();
    });

    it('leaves built-in values intact', () => {
        assert.tsType<ReadonlyData['object']>().equals<{readonly foo: string}>();
        assert.tsType<ReadonlyData['string']>().equals<string>();
        assert.tsType<ReadonlyData['number']>().equals<number>();
        assert.tsType<ReadonlyData['boolean']>().equals<boolean>();
        assert.tsType<ReadonlyData['symbol']>().equals<symbol>();
        assert.tsType<ReadonlyData['null']>().equals<null>();
        assert.tsType<ReadonlyData['undefined']>().equals<undefined>();
        assert.tsType<ReadonlyData['date']>().equals<Date>();
        assert.tsType<ReadonlyData['regExp']>().equals<RegExp>();
    });

    it('makes maps and sets deeply readonly', () => {
        assert.tsType<ReadonlyData['map']>().equals<Readonly<ReadonlyMap<string, string>>>();
        assert.tsType<ReadonlyData['set']>().equals<Readonly<ReadonlySet<string>>>();
        assert
            .tsType<ReadonlyData['readonlyMap']>()
            .equals<Readonly<ReadonlyMap<string, string>>>();
        assert.tsType<ReadonlyData['readonlySet']>().equals<Readonly<ReadonlySet<string>>>();
    });

    it('makes arrays and tuples readonly', () => {
        assert.tsType<ReadonlyData['array']>().equals<readonly string[]>();
        assert.tsType<ReadonlyData['emptyTuple']>().equals<readonly []>();
        assert.tsType<ReadonlyData['singleItemTuple']>().equals<readonly ['foo']>();
        assert.tsType<ReadonlyData['trailingSpreadTuple']>().equals<
            readonly [
                string,
                ...number[],
            ]
        >();
        assert.tsType<ReadonlyData['leadingSpreadTuple']>().equals<
            readonly [
                ...string[],
                number,
            ]
        >();
        assert.tsType<ReadonlyData['multiItemTuple']>().equals<
            readonly [
                {readonly a: string},
                {readonly b: number},
                {readonly c: string},
            ]
        >();
        assert.tsType<ReadonlyData['readonlyArray']>().equals<readonly string[]>();
        assert.tsType<ReadonlyData['readonlyTuple']>().equals<readonly ['foo']>();
    });

    it('makes properties of functions with a single signature readonly', () => {
        assert
            .tsType<ReadonlyData['namespace']>()
            .equals<((foo: number) => string) & {readonly baz: readonly boolean[]}>();
        assert.tsType<ReturnType<ReadonlyData['namespace']>>().equals<string>();
        assert.tsType<ReadonlyData['namespace']['baz']>().equals<readonly boolean[]>();
    });

    it('leaves overloaded functions with properties unchanged', () => {
        assert.tsType<ReadonlyData['namespaceWithOverload']>().equals<NamespaceWithOverload>();
        assert.tsType<ReadonlyData['namespaceWithOverload']['baz']>().equals<boolean[]>();
    });

    it('handles void property types', () => {
        assert.tsType<ReadonlyDeep<VoidType>>().equals<VoidTypeExpected>();
    });

    it('handles a standalone function with properties', () => {
        assert
            .tsType<ReadonlyNamespace>()
            .equals<((foo: number) => string) & {readonly baz: readonly boolean[]}>();
        assert
            .tsType<ReadonlyNamespace>()
            .matches<{(foo: number): string; readonly baz: readonly boolean[]}>();
    });
});
