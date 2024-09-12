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
                    await wait({milliseconds: 0});
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
                    await wait({milliseconds: 0});
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
                    await wait({milliseconds: 0});
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
            await wait({milliseconds: 0});
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
