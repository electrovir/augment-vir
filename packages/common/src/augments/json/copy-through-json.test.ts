import {assert} from '@augment-vir/assert';
import {type JsonCompatibleValue} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {copyThroughJson} from './copy-through-json.js';

describe(copyThroughJson.name, () => {
    it('handles unknown typed input', () => {
        assert.tsType(copyThroughJson({} as any as unknown)).equals<JsonCompatibleValue>();
    });

    it('should create an identical copy', () => {
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
            c: () => {},
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

        const unsafeResult = copyThroughJson(wideObject, {
            enableUnsafeCopyAll: true,
        });
        assert.deepEquals(unsafeResult, wideObject);
        assert.strictEquals(Object.keys(unsafeResult as Record<string, number>).length, 60);

        const safeResult = copyThroughJson(wideObject);
        assert.isBelow(
            Object.keys(safeResult as Record<string, number>).length,
            Object.keys(wideObject).length,
        );
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

        const unsafeResult = copyThroughJson(deepObject, {
            enableUnsafeCopyAll: true,
        });
        assert.deepEquals(unsafeResult, deepObject);

        const safeResult = copyThroughJson(deepObject) as Record<string, any>;
        assert.notDeepEquals(safeResult, deepObject);
    });

    it('throws on circular references', () => {
        const circular: Record<string, any> = {
            a: 1,
        };
        circular['self'] = circular;

        assert.throws(() =>
            copyThroughJson(circular, {
                enableUnsafeCopyAll: true,
            }),
        );
    });
});
