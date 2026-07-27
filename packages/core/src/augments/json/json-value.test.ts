import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type JsonArray, type JsonObject, type JsonPrimitive, type JsonValue} from './json-value.js';

describe('JsonPrimitive', () => {
    it('equals the set of JSON primitive types', () => {
        assert.tsType<JsonPrimitive>().equals<string | number | boolean | null>();
    });

    it('is assignable to JsonValue', () => {
        assert.tsType<JsonPrimitive>().matches<JsonValue>();
    });
});

describe('JsonValue', () => {
    it('matches primitive JSON values', () => {
        assert.tsType<string>().matches<JsonValue>();
        assert.tsType<number>().matches<JsonValue>();
        assert.tsType<boolean>().matches<JsonValue>();
        assert.tsType<null>().matches<JsonValue>();
    });

    it('matches arrays and nested objects', () => {
        assert
            .tsType([
                'a',
                1,
                true,
                null,
            ])
            .matches<JsonValue>();
        assert
            .tsType({
                nested: {
                    deep: [
                        1,
                        2,
                        3,
                    ],
                },
            })
            .matches<JsonValue>();
    });

    it('does not match non-JSON values', () => {
        assert.tsType<undefined>().notMatches<JsonValue>();
        assert.tsType<() => void>().notMatches<JsonValue>();
        assert.tsType<symbol>().notMatches<JsonValue>();
        assert.tsType<Date>().notMatches<JsonValue>();
    });
});

describe('JsonObject', () => {
    it('is assignable to JsonValue', () => {
        assert.tsType<JsonObject>().matches<JsonValue>();
    });

    it('matches a plain object of JSON values', () => {
        assert
            .tsType({
                a: 'value',
                b: 1,
                c: true,
            })
            .matches<JsonObject>();
    });

    it('allows optional properties', () => {
        assert.tsType<{a?: string}>().matches<JsonObject>();
    });

    it('rejects properties that can be undefined', () => {
        assert.tsType<{a: string | undefined}>().notMatches<JsonObject>();
        assert.tsType<{a?: string | undefined}>().notMatches<JsonObject>();
    });
});

describe('JsonArray', () => {
    it('is assignable to JsonValue', () => {
        assert.tsType<JsonArray>().matches<JsonValue>();
    });

    it('matches arrays of JSON values', () => {
        assert
            .tsType([
                1,
                'two',
                false,
                null,
            ])
            .matches<JsonArray>();
    });

    it('matches readonly arrays of JSON values', () => {
        assert.tsType<readonly JsonValue[]>().matches<JsonArray>();
    });
});
