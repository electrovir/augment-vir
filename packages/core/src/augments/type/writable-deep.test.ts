import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type WritableDeep} from './writable-deep.js';

type Overloaded = {
    (foo: number): string;
    (foo: string, bar: number): number;
};

type Namespace = {
    (foo: number): string;
    readonly baz: readonly boolean[];
};

type NamespaceWithOverload = Overloaded & {
    readonly baz: readonly boolean[];
};

type ReadonlyData = {
    readonly object: {readonly foo: 'bar'};
    readonly fn: (input: string) => boolean;
    readonly fnWithOverload: Overloaded;
    readonly namespace: Namespace;
    readonly namespaceWithOverload: NamespaceWithOverload;
    readonly string: string;
    readonly number: number;
    readonly boolean: boolean;
    readonly symbol: symbol;
    readonly date: Date;
    readonly regExp: RegExp;
    readonly null: null;
    readonly undefined: undefined;
    readonly map: Readonly<ReadonlyMap<string, string>>;
    readonly set: Readonly<ReadonlySet<string>>;
    readonly array: readonly string[];
    readonly emptyTuple: readonly [];
    readonly tuple: readonly ['foo'];
    readonly multiItemTuple: readonly [
        {readonly a: string},
        {readonly b: number},
    ];
    readonly spreadTuple: readonly [...string[]];
    readonly trailingSpreadTuple: readonly [
        string,
        ...number[],
    ];
    readonly leadingSpreadTuple: readonly [
        ...string[],
        number,
    ];
    readonly readonlyMap: Readonly<ReadonlyMap<string, string>>;
    readonly readonlySet: Readonly<ReadonlySet<string>>;
    readonly readonlyArray: readonly string[];
    readonly readonlyTuple: readonly ['foo'];
};

type WritableData = WritableDeep<ReadonlyData>;

type WritableNamespace = WritableDeep<{(foo: number): string; readonly baz: readonly boolean[]}>;

describe('WritableDeep', () => {
    it('makes top-level properties writable', () => {
        assert.tsType<WritableDeep<{readonly a: number}>>().equals<{a: number}>();
    });

    it('does not accept a deeply-readonly value as its writable version', () => {
        assert.tsType<ReadonlyData>().notMatches<WritableData>();
    });

    it('leaves plain functions unchanged', () => {
        assert.tsType<WritableData['fn']>().equals<(input: string) => boolean>();
        assert.tsType<WritableData['fnWithOverload']>().equals<Overloaded>();
    });

    it('removes readonly from objects and built-in values', () => {
        assert.tsType<WritableData['object']>().equals<{foo: 'bar'}>();
        assert.tsType<WritableData['string']>().equals<string>();
        assert.tsType<WritableData['number']>().equals<number>();
        assert.tsType<WritableData['boolean']>().equals<boolean>();
        assert.tsType<WritableData['symbol']>().equals<symbol>();
        assert.tsType<WritableData['null']>().equals<null>();
        assert.tsType<WritableData['undefined']>().equals<undefined>();
        assert.tsType<WritableData['date']>().equals<Date>();
        assert.tsType<WritableData['regExp']>().equals<RegExp>();
    });

    it('makes maps and sets writable', () => {
        assert.tsType<WritableData['map']>().equals<Map<string, string>>();
        assert.tsType<WritableData['set']>().equals<Set<string>>();
        assert.tsType<WritableData['readonlyMap']>().equals<Map<string, string>>();
        assert.tsType<WritableData['readonlySet']>().equals<Set<string>>();
    });

    it('makes arrays and tuples writable', () => {
        assert.tsType<WritableData['array']>().equals<string[]>();
        assert.tsType<WritableData['emptyTuple']>().equals<[]>();
        assert.tsType<WritableData['tuple']>().equals<['foo']>();
        assert.tsType<WritableData['multiItemTuple']>().equals<
            [
                {a: string},
                {b: number},
            ]
        >();
        assert.tsType<WritableData['spreadTuple']>().equals<[...string[]]>();
        assert.tsType<WritableData['trailingSpreadTuple']>().equals<
            [
                string,
                ...number[],
            ]
        >();
        assert.tsType<WritableData['leadingSpreadTuple']>().equals<
            [
                ...string[],
                number,
            ]
        >();
        assert.tsType<WritableData['readonlyArray']>().equals<string[]>();
        assert.tsType<WritableData['readonlyTuple']>().equals<['foo']>();
    });

    it('makes properties of functions with a single signature writable', () => {
        assert
            .tsType<WritableData['namespace']>()
            .equals<((foo: number) => string) & {baz: boolean[]}>();
        assert.tsType<ReturnType<WritableData['namespace']>>().equals<string>();
        assert.tsType<WritableData['namespace']['baz']>().equals<boolean[]>();
    });

    it('leaves overloaded functions with properties unchanged', () => {
        assert.tsType<WritableData['namespaceWithOverload']>().equals<NamespaceWithOverload>();
        assert.tsType<WritableData['namespaceWithOverload']['baz']>().equals<readonly boolean[]>();
    });

    it('handles a standalone function with properties', () => {
        assert.tsType<WritableNamespace>().equals<((foo: number) => string) & {baz: boolean[]}>();
        assert.tsType<WritableNamespace>().matches<{(foo: number): string; baz: boolean[]}>();
    });
});
