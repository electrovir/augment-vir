import {assert} from '@augment-vir/assert';
import {type JsonCompatibleValue} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {copyThroughJson, safeCopyThroughJson} from './copy-through-json.js';

describe(copyThroughJson.name, () => {
    it('handles unknown typed input', () => {
        assert.tsType(copyThroughJson({} as any as unknown)).equals<JsonCompatibleValue>();
    });

    it('creates an identical copy', () => {
        const testObjectA = {
            a: 5,
            b: 'five',
            c: {
                d: 5,
            },
            e: [6],
        };

        assert.deepEquals(copyThroughJson(testObjectA), testObjectA);
    });
    it('produces writable output', () => {
        const testObjectA = {
            a: 5,
            b: 'five',
            c: {
                d: 5,
            },
            e: [6],
        };

        const result = copyThroughJson(testObjectA);

        result.a = 10;

        assert.strictEquals(result.a, 10);
    });
    it('ignores non-JSON data', () => {
        const testObjectA = {
            a: new Map([
                [
                    'a',
                    'b',
                ],
                [
                    'c',
                    'd',
                ],
            ]),
            b: new Set([
                'a',
                'b',
                'c',
            ]),
            c() {},
        };
        assert.deepEquals(copyThroughJson(testObjectA), {
            a: {},
            b: {},
        });
    });

    it('preserves breadth beyond safe limit', () => {
        const wideObject: Record<string, number> = {};
        for (let i = 0; i < 60; i++) {
            wideObject[`key${i}`] = i;
        }

        const unsafeResult = copyThroughJson(wideObject);
        assert.deepEquals(unsafeResult, wideObject);
        assert.strictEquals(Object.keys(unsafeResult as Record<string, number>).length, 60);
    });

    it('preserves depth beyond safe limit', () => {
        let deepObject: Record<string, any> = {
            value: 'leaf',
        };
        for (let i = 0; i < 20; i++) {
            deepObject = {
                nested: deepObject,
            };
        }

        const unsafeResult = copyThroughJson(deepObject);
        assert.deepEquals(unsafeResult, deepObject);
    });

    it('throws on circular references', () => {
        const circular: Record<string, any> = {
            a: 1,
        };
        circular['self'] = circular;

        assert.throws(() => copyThroughJson(circular));
    });
});

describe(safeCopyThroughJson.name, () => {
    it('creates an identical copy for simple objects', () => {
        const testObject = {
            a: 5,
            b: 'five',
            c: {
                d: 5,
            },
            e: [6],
        };

        assert.deepEquals(safeCopyThroughJson(testObject), testObject);
    });

    it('truncates breadth beyond safe limit', () => {
        const wideObject: Record<string, number> = {};
        for (let index = 0; index < 60; index++) {
            wideObject[`key${index}`] = index;
        }

        const result = safeCopyThroughJson(wideObject);
        assert.isBelow(
            Object.keys(result as Record<string, number>).length,
            Object.keys(wideObject).length,
        );
    });

    it('truncates depth beyond safe limit', () => {
        let deepObject: Record<string, any> = {
            value: 'leaf',
        };
        for (let index = 0; index < 20; index++) {
            deepObject = {
                nested: deepObject,
            };
        }

        const result = safeCopyThroughJson(deepObject) as Record<string, any>;
        assert.notDeepEquals(result, deepObject);
    });

    it('handles circular references without throwing', () => {
        const circular: Record<string, any> = {
            a: 1,
        };
        circular['self'] = circular;

        const result = safeCopyThroughJson(circular);
        assert.deepEquals(result, {
            a: 1,
            self: '[Circular]',
        });
    });

    it('handles nested circular references without throwing', () => {
        const objectA: Record<string, any> = {
            name: 'a',
        };
        const objectB: Record<string, any> = {
            name: 'b',
            ref: objectA,
        };
        objectA['ref'] = objectB;

        const result = safeCopyThroughJson(objectA) as Record<string, any>;
        assert.strictEquals(result['name'], 'a');
        assert.strictEquals(result['ref']['name'], 'b');
        assert.strictEquals(result['ref']['ref'], '[Circular]');
    });
});
