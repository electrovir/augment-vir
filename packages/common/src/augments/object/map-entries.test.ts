import {assert} from '@augment-vir/assert';
import {wait, type MaybePromise} from '@augment-vir/core';
import {describe, it, itCases} from '@augment-vir/test';
import {mapObject} from './map-entries.js';

describe(mapObject.name, () => {
    const originalObject = {
        a: 'b',
        c: 'd',
        d: 'e',
    };

    itCases(mapObject<typeof originalObject, string, string>, [
        {
            it: 'omits an undefined output',
            inputs: [
                originalObject,
                (key, value) => {
                    if (key === 'a') {
                        return undefined;
                    } else {
                        return {
                            key: key + '1',
                            value: value + '1',
                        };
                    }
                },
            ],
            expect: {
                c1: 'd1',
                d1: 'e1',
            },
        },
        {
            it: 'omits an undefined promise',
            inputs: [
                originalObject,
                async (key, value) => {
                    await wait({
                        milliseconds: 0,
                    });
                    if (key === 'a') {
                        return undefined;
                    } else {
                        return {
                            key: key + '1',
                            value: value + '1',
                        };
                    }
                },
            ],
            expect: {
                c1: 'd1',
                d1: 'e1',
            },
        },
        {
            it: 'maps an object',
            inputs: [
                originalObject,
                (key, value) => {
                    return {
                        key: key + '1',
                        value: value + '1',
                    };
                },
            ],
            expect: {
                a1: 'b1',
                c1: 'd1',
                d1: 'e1',
            },
        },
        {
            it: 'maps an object with async callback',
            inputs: [
                originalObject,
                async (key, value) => {
                    await wait({
                        milliseconds: 0,
                    });
                    return {
                        key: key + '1',
                        value: value + '1',
                    };
                },
            ],
            expect: {
                a1: 'b1',
                c1: 'd1',
                d1: 'e1',
            },
        },
        {
            it: 'handles a callback that is sometimes async',
            inputs: [
                originalObject,
                (key, value) => {
                    if (key === 'a') {
                        return {
                            key: key + '1',
                            value: value + '1',
                        };
                    } else {
                        return Promise.resolve({
                            key: key + '1',
                            value: value + '1',
                        });
                    }
                },
            ],
            expect: {
                a1: 'b1',
                c1: 'd1',
                d1: 'e1',
            },
        },
        {
            it: 'handles a sync error',
            inputs: [
                originalObject,
                () => {
                    throw new Error('fake error');
                },
            ],
            throws: {
                matchMessage: 'fake error',
            },
        },
        {
            it: 'handles an async error',
            inputs: [
                originalObject,
                async () => {
                    await wait({
                        milliseconds: 0,
                    });
                    throw new Error('fake error');
                },
            ],
            throws: {
                matchMessage: 'fake error',
            },
        },
    ]);

    it('correctly types an async callback', async () => {
        const result = mapObject(originalObject, async (key, value) => {
            await wait({
                milliseconds: 0,
            });
            return {
                key: key + '1',
                value: value + '1',
            };
        });

        assert.tsType(result).equals<Promise<Record<string, string>>>();
        assert.isPromise(result);

        assert.deepEquals(await result, {
            a1: 'b1',
            c1: 'd1',
            d1: 'e1',
        });
    });

    it('correctly types a sync callback', () => {
        const result = mapObject(originalObject, (key, value) => {
            return {
                key: key + '1',
                value: value + '1',
            };
        });

        assert.tsType(result).notEquals<Promise<Record<string, string>>>();
        assert.tsType(result).equals<Record<string, string>>();
        assert.isNotPromise(result);

        assert.deepEquals(result, {
            a1: 'b1',
            c1: 'd1',
            d1: 'e1',
        });
    });

    it('does not include undefined in the value type for partial inputs', () => {
        const result = mapObject({} as Partial<Record<'a' | 'b', string>>, (key, value) => {
            assert.tsType(value).equals<string>();

            return {
                key,
                value: value.length,
            };
        });

        assert.tsType(result).equals<Record<'a' | 'b', number>>();
    });

    it('preserves undefined in value type when explicitly part of the value union', () => {
        const result = mapObject(
            {} as Partial<Record<'a' | 'b', string | undefined>>,
            (key, value) => {
                assert.tsType(value).equals<string | undefined>();

                return {
                    key,
                    value: 1,
                };
            },
        );

        assert.tsType(result).equals<Record<'a' | 'b', number>>();
    });

    it('resolves value type through generics constrained to Record', () => {
        type MyType = {
            shape: string;
            filter: string | undefined;
        };

        function genericCaller<const Init extends Record<string, MyType>>(init: Init) {
            return mapObject(init, (key, value) => {
                /** Verify that properties of the value type are accessible on a generic. */
                const shape: string = value.shape;

                return {
                    key,
                    value: shape,
                };
            });
        }

        const result = genericCaller({
            a: {
                shape: 'hello',
                filter: undefined,
            },
        });

        assert.deepEquals(result, {
            a: 'hello',
        });
    });

    it('correctly types a maybe async callback', () => {
        const result = mapObject(
            originalObject,
            (key, value): MaybePromise<{key: string; value: string}> => {
                return {
                    key: key + '1',
                    value: value + '1',
                };
            },
        );

        assert.tsType(result).equals<MaybePromise<Record<string, string>>>();
        assert.isNotPromise(result);

        assert.deepEquals(result, {
            a1: 'b1',
            c1: 'd1',
            d1: 'e1',
        });
    });
});
