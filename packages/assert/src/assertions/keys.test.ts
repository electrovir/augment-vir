import type {AnyFunction, UnknownObject} from '@augment-vir/core';
import {describe, it, itCases} from '@augment-vir/test';
import {assertWrap} from '../augments/guards/assert-wrap.js';
import {assert} from '../augments/guards/assert.js';
import {checkWrap} from '../augments/guards/check-wrap.js';
import {check} from '../augments/guards/check.js';
import {waitUntil} from '../augments/guards/wait-until.js';
import {waitUntilTestOptions} from '../test-timeout.mock.js';

describe('isKeyOf', () => {
    const actualPass: 'one' | 'two' = 'one' as any;
    const actualReject: 'one' | 'two' = 'two' as any;
    const expected = {
        one: 1,
        three: 3,
    };
    type ExpectedType = 'one';
    type UnexpectedType = keyof typeof expected;

    describe('assert', () => {
        it('guards', () => {
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isKeyOf(actualPass, expected);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isKeyOf(actualReject, expected));
        });
    });
    describe('check', () => {
        const symbolKey = Symbol('example');
        const stringKey = 'some string here';
        const numberKey = 48;

        itCases(check.isKeyOf, [
            {
                it: 'passes with a string prop on an object',
                inputs: [
                    stringKey,
                    {[stringKey]: 0},
                ],
                expect: true,
            },
            {
                it: 'passes with a symbol prop on an object',
                inputs: [
                    symbolKey,
                    {[symbolKey]: 0},
                ],
                expect: true,
            },
            {
                it: 'passes with a numeric prop on an object',
                inputs: [
                    numberKey,
                    {[numberKey]: 0},
                ],
                expect: true,
            },
            {
                it: 'passes with a prop from a function',
                inputs: [
                    'name',
                    () => {},
                ],
                expect: true,
            },
            {
                it: 'fails with a string key that does not exists in a function',
                inputs: [
                    stringKey,
                    () => {},
                ],
                expect: false,
            },
            {
                it: 'fails with a string key that does not exists in a object',
                inputs: [
                    stringKey,
                    {},
                ],
                expect: false,
            },
            {
                it: 'fails with a numeric key that does not exists in a object',
                inputs: [
                    numberKey,
                    {},
                ],
                expect: false,
            },
            {
                it: 'fails with a symbol key that does not exists in a object',
                inputs: [
                    symbolKey,
                    {},
                ],
                expect: false,
            },
        ]);
        it('guards', () => {
            assert.isTrue(check.isKeyOf(actualPass, expected));

            if (check.isKeyOf(actualPass, expected)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isKeyOf(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isKeyOf(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isKeyOf(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isKeyOf(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isKeyOf(actualReject, expected));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isKeyOf(
                expected,
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.deepEquals(actualPass, newValue);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.isKeyOf(expected, () => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});
describe('isNotKeyOf', () => {
    const actualPass: 'one' | 'two' = 'one' as any;
    const actualReject: 'one' | 'two' = 'two' as any;
    const expected = {
        two: 2,
        three: 3,
    };
    type ExpectedType = 'one';
    type UnexpectedType = 'two';

    describe('assert', () => {
        it('guards', () => {
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isNotKeyOf(actualPass, expected);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotKeyOf(actualReject, expected));
        });
    });
    describe('check', () => {
        const symbolKey = Symbol('example');
        const stringKey = 'some string here';
        const numberKey = 48;

        itCases(check.isNotKeyOf, [
            {
                it: 'rejects with a string prop on an object',
                inputs: [
                    stringKey,
                    {[stringKey]: 0},
                ],
                expect: false,
            },
            {
                it: 'rejects with a symbol prop on an object',
                inputs: [
                    symbolKey,
                    {[symbolKey]: 0},
                ],
                expect: false,
            },
            {
                it: 'rejects with a numeric prop on an object',
                inputs: [
                    numberKey,
                    {[numberKey]: 0},
                ],
                expect: false,
            },
            {
                it: 'rejects with a prop from a function',
                inputs: [
                    'name',
                    () => {},
                ],
                expect: false,
            },
            {
                it: 'accepts with a string key that does not exists in a function',
                inputs: [
                    stringKey,
                    () => {},
                ],
                expect: true,
            },
            {
                it: 'accepts with a string key that does not exists in a object',
                inputs: [
                    stringKey,
                    {},
                ],
                expect: true,
            },
            {
                it: 'accepts with a numeric key that does not exists in a object',
                inputs: [
                    numberKey,
                    {},
                ],
                expect: true,
            },
            {
                it: 'accepts with a symbol key that does not exists in a object',
                inputs: [
                    symbolKey,
                    {},
                ],
                expect: true,
            },
        ]);
        it('guards', () => {
            assert.isTrue(check.isNotKeyOf(actualPass, expected));

            if (check.isNotKeyOf(actualPass, expected)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotKeyOf(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotKeyOf(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotKeyOf(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotKeyOf(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotKeyOf(actualReject, expected));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotKeyOf(
                expected,
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.deepEquals(actualPass, newValue);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.isNotKeyOf(expected, () => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});

describe('hasKey', () => {
    const actualPass: UnknownObject = {
        one: 1,
    } as any;
    const actualReject: UnknownObject = {
        two: 2,
    } as any;
    const expected = 'one';
    type ExpectedType = {
        one: unknown;
    };
    type UnexpectedType = {
        two: unknown;
    };

    describe('assert', () => {
        it('guards', () => {
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.hasKey(actualPass, expected);

            assert.tsType(actualPass).matches<ExpectedType>();
            assert.tsType(actualPass).notMatches<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.hasKey(actualReject, expected));
        });
        it('works on arrays', () => {
            assert.hasKey(
                [
                    1,
                    2,
                    3,
                ],
                0,
            );
            assert.throws(() =>
                assert.hasKey(
                    [
                        1,
                        2,
                        3,
                    ],
                    10,
                ),
            );
        });
    });
    describe('check', () => {
        itCases(check.hasKey, [
            {
                it: 'accepts function keys',
                inputs: [
                    () => {},
                    'name',
                ],
                expect: true,
            },
            {
                it: 'rejects missing functions keys',
                inputs: [
                    () => {},
                    'concat',
                ],
                expect: false,
            },
            {
                it: 'accepts string object keys',
                inputs: [
                    'hello there',
                    'concat',
                ],
                expect: true,
            },
            {
                it: 'rejects missing string object keys',
                inputs: [
                    'hello there',
                    'name',
                ],
                expect: false,
            },
        ]);

        it('type guards an object with an unknown property', () => {
            const idkWhatThisIs: unknown = (() => {}) as unknown;
            if (check.hasKey(idkWhatThisIs, 'name')) {
                idkWhatThisIs.name;
                assert.tsType(idkWhatThisIs.name).equals<unknown>();
                /** Allows extra properties to be type guarded as well. */
                if (check.hasKey(idkWhatThisIs, 'derp')) {
                    idkWhatThisIs.derp;
                    assert.tsType(idkWhatThisIs.name).equals<unknown>();
                    assert.tsType(idkWhatThisIs.derp).equals<unknown>();
                }
            } else {
                // @ts-expect-error: name shouldn't exist outside of the type guard
                idkWhatThisIs.name;
            }
        });

        it('preserves the property type when known', () => {
            const whatever = {} as {name: string} | string | {derp: string};

            // @ts-expect-error: Should not be able to access the property in a union before type guarding it.
            whatever.name;

            if (check.hasKey(whatever, 'name')) {
                whatever.name;
                assert.tsType(whatever.name).equals<string>();
            }
        });

        it('preserves function properties', () => {
            const withFunction = {} as {callback: AnyFunction} | {stuff: string};

            if (check.hasKey(withFunction, 'callback')) {
                withFunction.callback;

                withFunction.callback();
            } else if (
                check.hasKey(withFunction, 'otherCallback') &&
                typeof withFunction.otherCallback === 'function'
            ) {
                withFunction.otherCallback();
            }
        });

        it('enforces that an optional property exists', () => {
            const whatever = {} as {name?: string};

            /** Can access the optional property but it might be undefined. */
            const maybeUndefined: string | undefined = whatever.name;
            // @ts-expect-error: the original property might be undefined
            const failsDefinedOnly: string = whatever.name;

            if (check.hasKey(whatever, 'name')) {
                assert.tsType(whatever.name).equals<string>();
            }
        });

        it('works with type parameters', () => {
            function testIsPromiseLike<T>(input: T) {
                if (check.hasKey(input, 'then')) {
                    input.then;
                }
            }
            testIsPromiseLike({});
        });

        it('allows further type narrowing', () => {
            function assertOutputProperty(
                keyPath: string,
                testExpectations: object,
                outputKey: string,
            ): void {
                if (!check.hasKey(testExpectations, outputKey)) {
                    throw new Error(`${keyPath} > ${outputKey} is missing.`);
                }

                const value = testExpectations[outputKey];

                if (typeof value !== 'string' && !check.isObject(value)) {
                    throw new TypeError(
                        `${keyPath} > "${outputKey}" is invalid. Got "${String(value)}"`,
                    );
                } else if (check.isObject(value)) {
                    if (!check.hasKey(value, 'type') || value.type !== 'regexp') {
                        throw new Error(
                            `${keyPath} > "${outputKey}".type is invalid. Expected "regexp".`,
                        );
                    }

                    value;

                    if (!check.hasKey(value, 'value') || typeof value.value !== 'string') {
                        throw new Error(
                            `${keyPath} > "${outputKey}".value is invalid. Expected a string.`,
                        );
                    }
                }
            }
        });

        it('guards', () => {
            assert.isTrue(check.hasKey(actualPass, expected));

            if (check.hasKey(actualPass, expected)) {
                assert.tsType(actualPass).matches<ExpectedType>();
                assert.tsType(actualPass).notMatches<UnexpectedType>();
            }

            assert.tsType(actualPass).notMatches<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.hasKey(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.hasKey(actualPass, expected);

            assert.tsType(newValue).matches<ExpectedType>();
            assert.tsType(newValue).notMatches<UnexpectedType>();
            assert.tsType(actualPass).notMatches<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.hasKey(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.hasKey(actualPass, expected);

            assert.tsType(newValue).matches<ExpectedType | undefined>();
            assert.tsType(newValue).notMatches<ExpectedType>();
            assert.tsType(newValue).notMatches<UnexpectedType>();
            assert.tsType(actualPass).notMatches<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.hasKey(actualReject, expected));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.hasKey(
                expected,
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).matches<ExpectedType>();
            assert.tsType(newValue).notMatches<UnexpectedType>();
            assert.tsType(actualPass).notMatches<ExpectedType>();

            assert.deepEquals(actualPass, newValue);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.hasKey(expected, () => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});
describe('lacksKey', () => {
    const actualPass: {one: number} | {two: number} = {
        one: 1,
    } as any;
    const actualReject: {one: number} | {two: number} = {
        two: 2,
    } as any;
    const expected = 'two';
    type ExpectedType = {one: number};
    type UnexpectedType = {one: number} | {two: number};

    describe('assert', () => {
        it('guards', () => {
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.lacksKey(actualPass, expected);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.lacksKey(actualReject, expected));
        });
        it('works on arrays', () => {
            assert.lacksKey(
                [
                    1,
                    2,
                    3,
                ],
                10,
            );
            assert.throws(() =>
                assert.lacksKey(
                    [
                        1,
                        2,
                        3,
                    ],
                    0,
                ),
            );
        });
    });
    describe('check', () => {
        itCases(check.lacksKey, [
            {
                it: 'rejects function keys',
                inputs: [
                    () => {},
                    'name',
                ],
                expect: false,
            },
            {
                it: 'accepts missing functions keys',
                inputs: [
                    () => {},
                    'concat',
                ],
                expect: true,
            },
            {
                it: 'rejects string object keys',
                inputs: [
                    'hello there',
                    'concat',
                ],
                expect: false,
            },
            {
                it: 'accepts missing string object keys',
                inputs: [
                    'hello there',
                    'name',
                ],
                expect: true,
            },
        ]);
        it('guards', () => {
            assert.isTrue(check.lacksKey(actualPass, expected));

            if (check.lacksKey(actualPass, expected)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.lacksKey(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.lacksKey(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.lacksKey(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.lacksKey(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.lacksKey(actualReject, expected));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.lacksKey(
                expected,
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.deepEquals(actualPass, newValue);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.lacksKey(expected, () => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});

describe('hasKeys', () => {
    const actualPass: UnknownObject = {
        one: 1,
        two: 2,
    } as any;
    const actualReject: UnknownObject = {
        three: 3,
    } as any;
    const expected = [
        'one',
        'two',
    ] as const;
    type ExpectedType = {
        one: unknown;
        two: unknown;
    };
    type UnexpectedType = {
        three: unknown;
    };

    describe('assert', () => {
        it('guards', () => {
            assert.tsType(actualPass).notMatches<ExpectedType>();

            assert.hasKeys(actualPass, expected);

            assert.tsType(actualPass).matches<ExpectedType>();
            assert.tsType(actualPass).notMatches<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.hasKeys(actualReject, expected));
        });
    });
    describe('check', () => {
        it('passes type checks', () => {
            const whatever = {} as {name: string} | string;

            // @ts-expect-error: Cannot access the property before it is type guarded.
            whatever.name;

            if (
                check.hasKeys(whatever, [
                    'name',
                ])
            ) {
                whatever.name;
                // @ts-expect-error: value has not been type guarded yet
                whatever.value;

                assert.tsType(whatever.name).matches<string>();
            }
            if (
                check.hasKeys(whatever, [
                    'name',
                    'value',
                ])
            ) {
                whatever.name;
                whatever.value;

                assert.tsType(whatever.name).matches<string>();
                assert.tsType(whatever.value).matches<string>();
            }

            type MaybePromise<T> =
                | (T extends Promise<infer ValueType> ? T | ValueType : Promise<T> | T)
                | undefined
                | {error: Error};

            const maybePromise = {} as MaybePromise<number>;

            if (check.isPromiseLike(maybePromise)) {
                const myPromise: PromiseLike<number> = maybePromise;
            } else if (check.hasKey(maybePromise, 'error')) {
                const myError: Error = maybePromise.error;
            } else {
                maybePromise;
            }
        });
        it('guards', () => {
            assert.isTrue(check.hasKeys(actualPass, expected));

            if (check.hasKeys(actualPass, expected)) {
                assert.tsType(actualPass).matches<ExpectedType>();
                assert.tsType(actualPass).notMatches<UnexpectedType>();
            }

            assert.tsType(actualPass).notMatches<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.hasKeys(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.hasKeys(actualPass, expected);

            assert.tsType(newValue).matches<ExpectedType>();
            assert.tsType(newValue).notMatches<UnexpectedType>();
            assert.tsType(actualPass).notMatches<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.hasKeys(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.hasKeys(actualPass, expected);

            assert.tsType(newValue).matches<ExpectedType | undefined>();
            assert.tsType(newValue).notMatches<ExpectedType>();
            assert.tsType(newValue).notMatches<UnexpectedType>();
            assert.tsType(actualPass).notMatches<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.hasKeys(actualReject, expected));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.hasKeys(
                expected,
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).matches<ExpectedType>();
            assert.tsType(newValue).notMatches<UnexpectedType>();
            assert.tsType(actualPass).notMatches<ExpectedType>();

            assert.deepEquals(actualPass, newValue);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.hasKeys(expected, () => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});
describe('lacksKeys', () => {
    const actualPass: {one: number} | {two: number} | {three: number} = {
        one: 1,
    } as any;
    const actualReject: {one: number} | {two: number} | {three: number} = {
        two: 2,
    } as any;
    const expected = [
        'two',
        'three',
    ] as const;
    type ExpectedType = {one: number};
    type UnexpectedType = {one: number} | {two: number} | {three: number};

    describe('assert', () => {
        it('guards', () => {
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.lacksKeys(actualPass, expected);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.lacksKeys(actualReject, expected));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.lacksKeys(actualPass, expected));

            if (check.lacksKeys(actualPass, expected)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.lacksKeys(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.lacksKeys(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.lacksKeys(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.lacksKeys(actualPass, expected);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.lacksKeys(actualReject, expected));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.lacksKeys(
                expected,
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.deepEquals(actualPass, newValue);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.lacksKeys(expected, () => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});
