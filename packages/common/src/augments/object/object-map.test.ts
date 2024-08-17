/* eslint-disable @typescript-eslint/ban-ts-comment */

import {assert} from '@augment-vir/assert';
import {getObjectTypedKeys, wait, waitValue, type Values} from '@augment-vir/core';
import {describe, it, itCases} from '@augment-vir/test';
import {randomString} from '../random/random-string.js';
import {mapObject, mapObjectValues, mapObjectValuesSync} from './object-map.js';

describe(mapObjectValuesSync.name, () => {
    it('should have proper types', () => {
        assert.notInstanceOf(
            mapObjectValuesSync({thing: 5})(async () => {
                return await waitValue({milliseconds: 40}, 0);
            }),
            Promise,
        );

        assert
            .tsType(
                mapObjectValuesSync({thing: 2})<{thing: number}>((key, value) => {
                    return 5;
                }),
            )
            .equals<{thing: number}>();
    });

    it('properly maps a partial object', () => {
        mapObjectValuesSync<Partial<Record<1 | 2 | 3 | 4, string>>>({})<{thing: number}>(
            (key, value) => {
                assert.tsType(value).equals<string>();

                return 4;
            },
        );
    });

    it('should properly map', () => {
        const startingObject = {
            a: '4',
            b: 52,
            c: /hello there/,
        } as const;

        const mappedObject = mapObjectValuesSync(startingObject)((key, value) => {
            assert.tsType(key).equals<keyof typeof startingObject>();
            assert.tsType(value).equals<Values<typeof startingObject>>();
            return String(value).length;
        });

        assert.deepEquals(mappedObject, {a: 1, b: 2, c: 13});
    });
});

describe(mapObjectValues.name, () => {
    function onlyAcceptNumbers(input: number): void {}
    function onlyAcceptStrings(input: string): void {}

    it("should map an object's values", () => {
        const originalObject = {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
        };

        // type tests
        onlyAcceptNumbers(originalObject.a);
        // @ts-expect-error
        onlyAcceptStrings(originalObject.a);

        const mappedObject = mapObjectValues(originalObject, (key, value) => {
            return String(value);
        });

        // type tests
        // @ts-expect-error
        onlyAcceptNumbers(mappedObject.a);
        onlyAcceptStrings(mappedObject.a);
        // @ts-expect-error
        mappedObject.q;

        assert.deepEquals(getObjectTypedKeys(originalObject), getObjectTypedKeys(mappedObject));

        getObjectTypedKeys(originalObject).forEach((key) => {
            assert.isTrue(originalObject.hasOwnProperty(key));
            assert.isTrue(mappedObject.hasOwnProperty(key));

            assert.deepEquals(Number(mappedObject[key]), originalObject[key]);
            assert.deepEquals(String(originalObject[key]), mappedObject[key]);
        });
    });

    it('should handle async errors thrown in the callback', async () => {
        const originalObject = {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
        };

        const errorMessage = randomString();

        await assert.throws(
            mapObjectValues(originalObject, async (key, value): Promise<any> => {
                return Promise.reject(new Error(errorMessage));
            }),
            {
                matchMessage: errorMessage,
            },
        );
    });

    it('should work with promises', async () => {
        const originalObject = {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
        };

        const mappedObject = mapObjectValues(originalObject, async (key, value) => {
            return Promise.resolve(String(value));
        });

        // type tests
        // @ts-expect-error
        onlyAcceptNumbers(mappedObject.a);
        // @ts-expect-error
        onlyAcceptStrings(mappedObject.a);
        // @ts-expect-error
        mappedObject.q;

        const awaitedMappedObject = await mappedObject;

        // type tests
        // @ts-expect-error
        onlyAcceptNumbers(awaitedMappedObject.a);
        onlyAcceptStrings(awaitedMappedObject.a);
        // @ts-expect-error
        awaitedMappedObject.q;

        assert.deepEquals(
            getObjectTypedKeys(originalObject),
            getObjectTypedKeys(awaitedMappedObject),
        );

        getObjectTypedKeys(originalObject).forEach((key) => {
            assert.isTrue(originalObject.hasOwnProperty(key));
            assert.isTrue(awaitedMappedObject.hasOwnProperty(key));

            assert.deepEquals(Number(awaitedMappedObject[key]), originalObject[key]);
            assert.deepEquals(String(originalObject[key]), awaitedMappedObject[key]);
        });
    });

    it('properly maps a partial object', () => {
        const result = mapObjectValues(
            {} as Partial<Record<1 | 2 | 3 | 4, string>>,
            (key, value): number => {
                assert.tsType(value).equals<string>();

                return 4;
            },
        );

        assert.tsType(result).equals<Partial<Record<1 | 2 | 3 | 4, number>>>();
    });

    it('should preserve properties with complex value types', () => {
        const originalObject = {
            a: 1,
            b: {what: 'two'},
            c: '3',
            d: 4,
            e: 5,
        };

        // type tests
        onlyAcceptNumbers(originalObject.a);
        // @ts-expect-error
        onlyAcceptNumbers(originalObject.b);
        // @ts-expect-error
        onlyAcceptNumbers(originalObject.c);
        // @ts-expect-error
        onlyAcceptStrings(originalObject.a);

        const mappedObject = mapObjectValues(originalObject, (key, value) => {
            return String(value);
        });

        // type tests
        // @ts-expect-error
        onlyAcceptNumbers(mappedObject.a);
        // @ts-expect-error
        onlyAcceptNumbers(mappedObject.b);
        // @ts-expect-error
        onlyAcceptNumbers(mappedObject.c);
        onlyAcceptStrings(mappedObject.b);
        onlyAcceptStrings(mappedObject.c);
        onlyAcceptStrings(mappedObject.a);
        // @ts-expect-error
        mappedObject.q;
    });
});

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
                        return new Promise((resolve) => {
                            resolve({
                                key: key + '1',
                                value: value + '1',
                            });
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

        assert.isPromise(result);
        assert.tsType(result).equals<Promise<Record<string, string>>>();

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

        assert.isNotPromise(result);
        assert.tsType(result).notEquals<Promise<Record<string, string>>>();

        assert.deepEquals(result, {
            a1: 'b1',
            c1: 'd1',
            d1: 'e1',
        });
    });
});
