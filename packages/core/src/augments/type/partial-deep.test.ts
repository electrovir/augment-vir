import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type PartialDeep} from './partial-deep.js';
import {type Simplify} from './simplify.js';

class ClassA {
    public foo = 1;
}

type Bar = {
    function: (input: string) => void;
    classConstructor: typeof ClassA;
    object: {key: string};
    string: string;
    number: number;
    boolean: boolean;
    date: Date;
    regexp: RegExp;
    symbol: symbol;
    null: null;
    undefined: undefined;
    map: Map<string, string>;
    set: Set<string>;
    array: string[];
    tuple: ['foo'];
    readonlyMap: ReadonlyMap<string, string>;
    readonlySet: ReadonlySet<string>;
    readonlyArray: readonly string[];
    readonlyTuple: readonly ['foo'];
};

type Foo = {
    baz: string;
    bar: Bar;
};

type PartialDeepFoo = PartialDeep<Foo, {recurseIntoArrays: true}>;
type PartialDeepBar = PartialDeep<Bar, {recurseIntoArrays: true}>;
type PartialDeepNoRecurseFoo = PartialDeep<Foo>;
type PartialDeepNoRecurseBar = PartialDeep<Bar, {recurseIntoArrays: false}>;
type AllowUndefinedBar = PartialDeep<
    Bar,
    {recurseIntoArrays: true; allowUndefinedInNonTupleArrays: true}
>;

type Recurse = string | number | boolean | null | Record<string, Recurse[]> | Recurse[];
type RecurseObject = {value: Recurse};

type FunctionWithProperties = {(a1: string, a2: number): boolean; p1: string; readonly p2: number};
type PartialFunctionWithProperties = PartialDeep<FunctionWithProperties>;

type FunctionWithProperties2 = {
    (a1: boolean, ...a2: string[]): number;
    p1: {p2?: string; p3: {readonly p4?: boolean}};
};
type PartialFunctionWithProperties2 = PartialDeep<FunctionWithProperties2>;

type FunctionWithProperties3 = {
    (): void;
    p1: {
        p2?: string;
        p3: [
            {p4: number},
            string,
        ];
    };
};
type PartialFunctionWithProperties3 = PartialDeep<
    FunctionWithProperties3,
    {recurseIntoArrays: true}
>;

type FunctionWithProperties4 = {(a1: number): string; (a1: string, a2: number): number; p1: string};
type PartialFunctionWithProperties4 = PartialDeep<FunctionWithProperties4>;

describe('PartialDeep', () => {
    it('is deeper than the built-in Partial', () => {
        assert.tsType<PartialDeepFoo>().notEquals<Partial<Foo>>();
        assert.tsType<PartialDeepNoRecurseFoo>().notEquals<Partial<Foo>>();
    });

    it('makes nested object properties optional', () => {
        assert.tsType<PartialDeepFoo['bar']>().equals<PartialDeepBar | undefined>();
    });

    it('leaves built-in and constructor values intact', () => {
        assert.tsType<PartialDeepBar['classConstructor']>().equals<typeof ClassA | undefined>();
        assert.tsType<PartialDeepBar['function']>().equals<((input: string) => void) | undefined>();
        assert.tsType<PartialDeepBar['object']>().matches<object | undefined>();
        assert.tsType<PartialDeepBar['string']>().equals<string | undefined>();
        assert.tsType<PartialDeepBar['number']>().equals<number | undefined>();
        assert.tsType<PartialDeepBar['boolean']>().equals<boolean | undefined>();
        assert.tsType<PartialDeepBar['date']>().equals<Date | undefined>();
        assert.tsType<PartialDeepBar['regexp']>().equals<RegExp | undefined>();
        assert.tsType<PartialDeepBar['symbol']>().equals<symbol | undefined>();
        assert.tsType<PartialDeepBar['null']>().equals<null | undefined>();
        assert.tsType<PartialDeepBar['undefined']>().equals<undefined>();
    });

    it('recurses into maps and sets', () => {
        assert
            .tsType<PartialDeepBar['map']>()
            .matches<Map<string | undefined, string | undefined> | undefined>();
        assert.tsType<PartialDeepBar['set']>().matches<Set<string | undefined> | undefined>();
        assert
            .tsType<PartialDeepBar['readonlyMap']>()
            .matches<ReadonlyMap<string | undefined, string | undefined> | undefined>();
        assert
            .tsType<PartialDeepBar['readonlySet']>()
            .matches<ReadonlySet<string | undefined> | undefined>();
    });

    it('recurses into arrays and tuples when recurseIntoArrays is true', () => {
        assert.tsType<PartialDeepBar['array']>().equals<string[] | undefined>();
        assert.tsType<PartialDeepBar['tuple']>().equals<['foo'?] | undefined>();
        assert.tsType<PartialDeepBar['readonlyArray']>().equals<readonly string[] | undefined>();
        assert.tsType<PartialDeepBar['readonlyTuple']>().equals<readonly ['foo'?] | undefined>();
    });

    it('leaves arrays and tuples intact by default', () => {
        assert
            .tsType<PartialDeepNoRecurseFoo['bar']>()
            .equals<PartialDeepNoRecurseBar | undefined>();
        assert.tsType<PartialDeepNoRecurseBar['array']>().equals<string[] | undefined>();
        assert.tsType<PartialDeepNoRecurseBar['tuple']>().equals<['foo'] | undefined>();
        assert
            .tsType<PartialDeepNoRecurseBar['readonlyArray']>()
            .equals<readonly string[] | undefined>();
        assert
            .tsType<PartialDeepNoRecurseBar['readonlyTuple']>()
            .equals<readonly ['foo'] | undefined>();
    });

    it('allows undefined in non-tuple arrays when enabled', () => {
        assert.tsType<AllowUndefinedBar['array']>().equals<Array<string | undefined> | undefined>();
    });

    it('does not recurse infinitely on recursive types', () => {
        assert.tsType<RecurseObject>().matches<PartialDeep<RecurseObject>>();
    });

    it('makes properties of functions with a single signature optional', () => {
        assert.tsType<ReturnType<PartialFunctionWithProperties>>().equals<boolean>();
        assert
            .tsType<Simplify<PartialFunctionWithProperties>>()
            .equals<{p1?: string; readonly p2?: number}>();

        assert.tsType<ReturnType<PartialFunctionWithProperties2>>().equals<number>();
        assert
            .tsType<Simplify<PartialFunctionWithProperties2>>()
            .equals<{p1?: {p2?: string; p3?: {readonly p4?: boolean}}}>();

        assert.tsType<ReturnType<PartialFunctionWithProperties3>>().equals<void>();
        assert.tsType<Simplify<PartialFunctionWithProperties3>>().equals<{
            p1?: {
                p2?: string;
                p3?: [
                    {p4?: number}?,
                    string?,
                ];
            };
        }>();
    });

    it('does not depend on allowUndefinedInNonTupleArrays for tuple element properties', () => {
        assert
            .tsType<
                Simplify<
                    PartialDeep<{(): void; p1: string[]}, {allowUndefinedInNonTupleArrays: false}>
                >
            >()
            .equals<{p1?: string[]}>();
        assert
            .tsType<
                Simplify<
                    PartialDeep<{(): void; p1: string[]}, {allowUndefinedInNonTupleArrays: true}>
                >
            >()
            .equals<{p1?: string[]}>();
    });

    it('does not make properties of multi-signature functions optional', () => {
        assert.tsType<ReturnType<PartialFunctionWithProperties4>>().equals<number>();
        assert.tsType<Simplify<PartialFunctionWithProperties4>>().notEquals<{p1?: string}>();
    });
});
