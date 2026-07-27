/* eslint-disable @typescript-eslint/no-empty-object-type -- Jsonify of an all-optional-union object resolves to the `{}` type. */
// cspell:words jsonifies jsonable
import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type JsonValue} from './json-value.js';
import {type Jsonify} from './jsonify.js';

type SimpleObject = {
    a: number;
};

/**
 * An interface (as opposed to a type alias) is _not_ assignable to `JsonValue` even when its shape
 * is otherwise valid JSON, because interfaces lack an implicit index signature.
 */
interface InterfaceWithOptionalNumber {
    a?: number;
}

type NonJsonWithToJson = {
    fixture: Map<string, number>;
    toJSON(): {
        fixture: Array<
            [
                string,
                number,
            ]
        >;
    };
};

type NonJsonWithInvalidToJson = {
    fixture: Map<string, number>;
    toJSON(): {
        fixture: Map<string, number>;
    };
};

type InnerFixture = {
    fixture: Array<
        [
            string,
            number,
        ]
    >;
};

type NonJsonWithToJsonWrapper = {
    inner: NonJsonWithToJson;
    toJSON(): {
        override: string;
        inner: NonJsonWithToJson;
        innerDeep: {
            inner: NonJsonWithToJson;
        };
    };
};

type OptionalPrimitive = {
    a?: string;
};

type OptionalTypeUnion = {
    a?: string | (() => any);
};

type NonOptionalTypeUnion = {
    a: string | undefined;
};

type AppData = {
    requiredString: string;
    requiredUnion: number | boolean;
    optionalString?: string;
    optionalUnion?: number | string;
    optionalStringUndefined: string | undefined;
    optionalUnionUndefined: number | string | undefined;
    requiredFunction: () => any;
    optionalFunction?: () => any;
    requiredFunctionUnion: string | (() => any);
    optionalFunctionUnion?: string | (() => any);
    optionalFunctionUndefined: (() => any) | undefined;
    optionalFunctionUnionUndefined: string | (() => any) | undefined;
};

type ExpectedAppDataJson = {
    requiredString: string;
    requiredUnion: number | boolean;
    optionalString?: string;
    optionalUnion?: string | number;
    optionalStringUndefined?: string;
    optionalUnionUndefined?: string | number;
};

type NestedName = {
    first: {
        name: string;
    };
};

describe('Jsonify', () => {
    it('leaves valid JSON values assignable to JsonValue', () => {
        assert.tsType(null).matches<JsonValue>();
        assert.tsType(false).matches<JsonValue>();
        assert.tsType(0).matches<JsonValue>();
        assert.tsType('').matches<JsonValue>();
        assert.tsType([]).matches<JsonValue>();
        assert.tsType([] as const).matches<JsonValue>();
        assert.tsType({}).matches<JsonValue>();
        assert.tsType([0]).matches<JsonValue>();
        assert
            .tsType({
                a: 0,
            })
            .matches<JsonValue>();
        assert
            .tsType({
                a: {
                    b: true,
                    c: {},
                },
                d: [
                    {},
                    2,
                    'hi',
                ],
            })
            .matches<JsonValue>();
        assert
            .tsType([
                {},
                {
                    a: 'hi',
                },
                null,
                3,
            ])
            .matches<JsonValue>();
        assert.tsType<Jsonify<SimpleObject>>().matches<JsonValue>();
    });

    it('makes non-JSON values not assignable to JsonValue', () => {
        assert.tsType<Date>().notMatches<JsonValue>();
        assert.tsType<Date[]>().notMatches<JsonValue>();
        assert.tsType<InterfaceWithOptionalNumber>().notMatches<JsonValue>();
        assert.tsType<{a: Date}>().notMatches<JsonValue>();
        assert.tsType<{a?: Date}>().notMatches<JsonValue>();
        assert.tsType<{a: number | undefined}>().notMatches<JsonValue>();
        assert.tsType<{a?: () => any}>().notMatches<JsonValue>();
        assert.tsType<undefined>().notMatches<JsonValue>();
        assert.tsType<() => void>().notMatches<JsonValue>();
        assert.tsType<symbol>().notMatches<JsonValue>();
        assert.tsType<number | undefined>().notMatches<JsonValue>();
    });

    it('jsonifies an object that contains a tuple property', () => {
        const point: {
            type: 'Point' | 'Polygon';
            coordinates: [
                number,
                number,
            ];
        } = {
            type: 'Point',
            coordinates: [
                1,
                1,
            ],
        };

        assert.tsType(point).matches<Jsonify<typeof point>>();
    });

    it('uses a toJSON method when present', () => {
        assert.tsType<Jsonify<Date>>().matches<string>();
        assert.tsType<Jsonify<Date>>().matches<JsonValue>();

        assert.tsType<Jsonify<{a: Date}>>().matches<JsonValue>();
        assert.tsType<Jsonify<{a: Date}>['a']>().matches<string>();

        assert.tsType<NonJsonWithToJson>().notMatches<JsonValue>();
        assert.tsType<ReturnType<NonJsonWithToJson['toJSON']>>().matches<JsonValue>();
        assert.tsType<Jsonify<NonJsonWithToJson>>().equals<InnerFixture>();
    });

    it('recurses into a toJSON result that is not directly JSON', () => {
        assert.tsType<NonJsonWithToJsonWrapper>().notMatches<JsonValue>();
        assert.tsType<Jsonify<NonJsonWithToJsonWrapper>>().equals<{
            override: string;
            inner: InnerFixture;
            innerDeep: {
                inner: InnerFixture;
            };
        }>();
    });

    it('does not jsonify an invalid toJSON result', () => {
        assert.tsType<NonJsonWithInvalidToJson>().notMatches<JsonValue>();
        assert.tsType<ReturnType<NonJsonWithInvalidToJson['toJSON']>>().notMatches<JsonValue>();
    });

    it('turns non-jsonable plain values into never', () => {
        assert.tsType<Jsonify<undefined>>().equals<never>();
        assert.tsType<Jsonify<() => void>>().equals<never>();
        assert.tsType<Jsonify<symbol>>().equals<never>();
        assert.tsType<Jsonify<bigint>>().equals<never>();
    });

    it('turns non-jsonable array members into null', () => {
        assert.tsType<Jsonify<undefined[]>>().equals<null[]>();
        assert.tsType<Jsonify<Array<() => void>>>().equals<null[]>();
        assert.tsType<Jsonify<symbol[]>>().equals<null[]>();
        assert.tsType<Jsonify<Array<number | undefined>>>().equals<Array<number | null>>();
        assert
            .tsType<
                Jsonify<
                    | Array<Array<number | undefined>>
                    | {
                          foo: Array<number | undefined>;
                      }
                >
            >()
            .equals<
                | Array<Array<number | null>>
                | {
                      foo: Array<number | null>;
                  }
            >();
    });

    it('filters non-jsonable object values', () => {
        assert.tsType<Jsonify<{keep: string; extra: undefined}>>().equals<{keep: string}>();
        assert.tsType<Jsonify<{keep: string; extra: () => void}>>().equals<{keep: string}>();
        assert.tsType<Jsonify<{keep: string; extra: symbol}>>().equals<{keep: string}>();
        assert.tsType<Jsonify<{[key: symbol]: number; keep: string}>>().equals<{keep: string}>();
    });

    it('jsonifies tuples', () => {
        assert
            .tsType<
                Jsonify<
                    [
                        string,
                        Date,
                    ]
                >
            >()
            .equals<
                [
                    string,
                    string,
                ]
            >();
        assert
            .tsType<
                Jsonify<
                    [
                        string,
                        ...Date[],
                    ]
                >
            >()
            .equals<
                [
                    string,
                    ...string[],
                ]
            >();
        assert
            .tsType<
                Jsonify<
                    [
                        '1',
                        () => void,
                        2,
                    ]
                >
            >()
            .equals<
                [
                    '1',
                    null,
                    2,
                ]
            >();
        assert.tsType<Jsonify<string[] & ['some value']>>().equals<['some value']>();
        assert
            .tsType<
                Jsonify<
                    readonly [
                        1,
                        2,
                        3,
                    ]
                >
            >()
            .equals<
                [
                    1,
                    2,
                    3,
                ]
            >();
    });

    it('jsonifies typed arrays into records', () => {
        assert.tsType<Jsonify<Int8Array>>().equals<Record<string, number>>();
    });

    it('jsonifies maps and sets into empty objects', () => {
        assert.tsType({}).matches<Jsonify<Map<string, number>>>();
        assert.tsType<number>().notMatches<Jsonify<Map<string, number>>>();
        assert.tsType({}).matches<Jsonify<Set<string>>>();
        assert.tsType<number>().notMatches<Jsonify<Set<string>>>();
    });

    it('keeps optional members optional', () => {
        assert.tsType<Jsonify<OptionalPrimitive>>().equals<{a?: string}>();
        assert.tsType<Jsonify<OptionalTypeUnion>>().equals<{}>();
        assert.tsType<Jsonify<NonOptionalTypeUnion>>().equals<{a?: string}>();
        assert.tsType<Jsonify<AppData>>().equals<ExpectedAppDataJson>();
    });

    it('passes any through unchanged', () => {
        assert.tsType<Jsonify<any>>().equals<any>();
        assert.tsType<Jsonify<{a: any}>>().equals<{a: any}>();
        assert.tsType<Jsonify<Record<string, any>>>().equals<Record<string, any>>();
    });

    it('preserves a nested object that only has a name property', () => {
        assert.tsType<Jsonify<NestedName>>().equals<NestedName>();
    });

    it('resolves unknown values into JsonValue', () => {
        assert.tsType<Jsonify<unknown>>().equals<JsonValue>();
        assert.tsType('foo').matches<Jsonify<unknown>>();
        assert.tsType(['foo']).matches<Jsonify<unknown>>();
        assert.tsType<Date>().notMatches<Jsonify<unknown>>();

        assert.tsType<Jsonify<unknown[]>>().equals<JsonValue[]>();
        assert.tsType(['foo']).matches<Jsonify<unknown[]>>();
        assert.tsType<Date[]>().notMatches<Jsonify<unknown[]>>();

        assert
            .tsType<
                Jsonify<
                    [
                        unknown,
                        unknown,
                    ]
                >
            >()
            .equals<
                [
                    JsonValue,
                    JsonValue,
                ]
            >();
        assert
            .tsType<
                [
                    string,
                    string,
                ]
            >()
            .matches<
                Jsonify<
                    [
                        unknown,
                        unknown,
                    ]
                >
            >();
        assert
            .tsType<
                [
                    Date,
                    Date,
                ]
            >()
            .notMatches<
                Jsonify<
                    [
                        unknown,
                        unknown,
                    ]
                >
            >();

        assert.tsType<Jsonify<{key: unknown}>>().equals<{key: JsonValue}>();
        assert
            .tsType({
                key: [],
            })
            .matches<Jsonify<{key: unknown}>>();
        assert.tsType<{key: Date}>().notMatches<Jsonify<{key: unknown}>>();
    });
});
