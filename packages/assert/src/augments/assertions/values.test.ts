import {describe, it, itCases} from '@augment-vir/test';
import type {EmptyObject} from 'type-fest';
import {AssertionError} from '../assertion.error.js';
import {assertWrap} from '../guards/assert-wrap.js';
import {assert} from '../guards/assert.js';
import {checkWrap} from '../guards/check-wrap.js';
import {check} from '../guards/check.js';
import {waitUntil} from '../guards/wait-until.js';
import {waitUntilTestOptions} from '../test-timeout.mock.js';

describe('hasValue', () => {
    const a = 'a';
    const b = 'b';
    const parentObject = {
        stringKey: a,
        [Symbol('symbolKey')]: b,
    };
    const parentArray = [
        a,
        b,
    ];

    describe('assert', () => {
        itCases(assert.hasValue, [
            {
                it: 'passes on a string key',
                inputs: [
                    parentObject,
                    a,
                ],
                throws: undefined,
            },
            {
                it: 'passes on a symbol key',
                inputs: [
                    parentObject,
                    b,
                ],
                throws: undefined,
            },
            {
                it: 'passes on an array',
                inputs: [
                    parentArray,
                    a,
                ],
                throws: undefined,
            },
            {
                it: 'rejects on an object',
                inputs: [
                    parentObject,
                    'c',
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'does not have value',
                },
            },
            {
                it: 'rejects on an array',
                inputs: [
                    parentArray,
                    'c',
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'does not have value',
                },
            },
        ]);
    });
    describe('check', () => {
        itCases(check.hasValue, [
            {
                it: 'passes on a string key',
                inputs: [
                    parentObject,
                    a,
                ],
                expect: true,
            },
            {
                it: 'passes on a symbol key',
                inputs: [
                    parentObject,
                    b,
                ],
                expect: true,
            },
            {
                it: 'passes on an array',
                inputs: [
                    parentArray,
                    a,
                ],
                expect: true,
            },
            {
                it: 'rejects on an object',
                inputs: [
                    parentObject,
                    'c',
                ],
                expect: false,
            },
            {
                it: 'rejects on an array',
                inputs: [
                    parentArray,
                    'c',
                ],
                expect: false,
            },
        ]);
    });
    describe('assertWrap', () => {
        itCases(assertWrap.hasValue, [
            {
                it: 'passes on a string key',
                inputs: [
                    parentObject,
                    a,
                ],
                expect: parentObject,
            },
            {
                it: 'passes on a symbol key',
                inputs: [
                    parentObject,
                    b,
                ],
                expect: parentObject,
            },
            {
                it: 'passes on an array',
                inputs: [
                    parentArray,
                    a,
                ],
                expect: parentArray,
            },
            {
                it: 'rejects on an object',
                inputs: [
                    parentObject,
                    'c',
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'does not have value',
                },
            },
            {
                it: 'rejects on an array',
                inputs: [
                    parentArray,
                    'c',
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'does not have value',
                },
            },
        ]);
    });
    describe('checkWrap', () => {
        itCases(checkWrap.hasValue, [
            {
                it: 'passes on a string key',
                inputs: [
                    parentObject,
                    a,
                ],
                expect: parentObject,
            },
            {
                it: 'passes on a symbol key',
                inputs: [
                    parentObject,
                    b,
                ],
                expect: parentObject,
            },
            {
                it: 'passes on an array',
                inputs: [
                    parentArray,
                    a,
                ],
                expect: parentArray,
            },
            {
                it: 'rejects on an object',
                inputs: [
                    parentObject,
                    'c',
                ],
                expect: undefined,
            },
            {
                it: 'rejects on an array',
                inputs: [
                    parentArray,
                    'c',
                ],
                expect: undefined,
            },
        ]);
    });
    describe('waitUntil', () => {
        it('passes', async () => {
            let counter = 0;
            const newValue = await waitUntil.hasValue(
                a,
                () => {
                    ++counter;
                    if (counter > 2) {
                        return parentObject;
                    } else {
                        return {};
                    }
                },
                waitUntilTestOptions,
                'failure',
            );
            assert.deepEquals(newValue, parentObject);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.hasValue(
                    a,
                    () => {
                        return [];
                    },
                    waitUntilTestOptions,
                    'failure',
                ),
            );
        });
    });
});

describe('hasValues', () => {
    const a = 'a';
    const b = 'b';
    const parentObject = {
        stringKey: a,
        [Symbol('symbolKey')]: b,
    };
    const parentArray = [
        a,
        b,
    ];

    describe('assert', () => {
        itCases(assert.hasValues, [
            {
                it: 'passes on an object',
                inputs: [
                    parentObject,
                    [
                        a,
                        b,
                    ],
                ],
                throws: undefined,
            },
            {
                it: 'passes on an array',
                inputs: [
                    parentArray,
                    [
                        a,
                        b,
                    ],
                ],
                throws: undefined,
            },
            {
                it: 'rejects on an object',
                inputs: [
                    parentObject,
                    ['c'],
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'does not have value',
                },
            },
            {
                it: 'rejects on an array',
                inputs: [
                    parentArray,
                    ['c'],
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'does not have value',
                },
            },
        ]);
    });
    describe('check', () => {
        itCases(check.hasValues, [
            {
                it: 'passes on an object',
                inputs: [
                    parentObject,
                    [
                        a,
                        b,
                    ],
                ],
                expect: true,
            },
            {
                it: 'passes on an array',
                inputs: [
                    parentArray,
                    [
                        a,
                        b,
                    ],
                ],
                expect: true,
            },
            {
                it: 'rejects on an object',
                inputs: [
                    parentObject,
                    ['c'],
                ],
                expect: false,
            },
            {
                it: 'rejects on an array',
                inputs: [
                    parentArray,
                    ['c'],
                ],
                expect: false,
            },
        ]);
    });
    describe('assertWrap', () => {
        itCases(assertWrap.hasValues, [
            {
                it: 'passes on a string key',
                inputs: [
                    parentObject,
                    [
                        a,
                        b,
                    ],
                ],
                expect: parentObject,
            },
            {
                it: 'passes on an array',
                inputs: [
                    parentArray,
                    [
                        a,
                        b,
                    ],
                ],
                expect: parentArray,
            },
            {
                it: 'rejects on an object',
                inputs: [
                    parentObject,
                    ['c'],
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'does not have value',
                },
            },
            {
                it: 'rejects on an array',
                inputs: [
                    parentArray,
                    ['c'],
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'does not have value',
                },
            },
        ]);
    });
    describe('checkWrap', () => {
        itCases(checkWrap.hasValues, [
            {
                it: 'passes on a string key',
                inputs: [
                    parentObject,
                    [
                        a,
                        b,
                    ],
                ],
                expect: parentObject,
            },
            {
                it: 'passes on an array',
                inputs: [
                    parentArray,
                    [
                        a,
                        b,
                    ],
                ],
                expect: parentArray,
            },
            {
                it: 'rejects on an object',
                inputs: [
                    parentObject,
                    ['c'],
                ],
                expect: undefined,
            },
            {
                it: 'rejects on an array',
                inputs: [
                    parentArray,
                    ['c'],
                ],
                expect: undefined,
            },
        ]);
    });
    describe('waitUntil', () => {
        it('passes', async () => {
            let counter = 0;
            const newValue = await waitUntil.hasValues(
                [
                    a,
                    b,
                ],
                () => {
                    ++counter;
                    if (counter > 2) {
                        return parentObject;
                    } else {
                        return {};
                    }
                },
                waitUntilTestOptions,
                'failure',
            );
            assert.deepEquals(newValue, parentObject);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.hasValues(
                    [
                        a,
                        'c',
                    ],
                    () => {
                        return [];
                    },
                    waitUntilTestOptions,
                    'failure',
                ),
            );
        });
    });
});

describe('isIn', () => {
    const actualPass: 'yo' | 'missing' = 'yo' as any;
    const actualReject: 'yo' | 'missing' = 'missing' as any;
    const expected = [
        'yo',
        'hello',
        'hi',
    ] as const;
    type ExpectedType = 'yo';
    type UnexpectedType = string;
    const expectedObject = {
        a: 'yo',
        b: 'hello',
        c: 'hi',
    } as const;

    describe('assert', () => {
        it('guards an array', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isIn(actualPass, expected);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('guards on object', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isIn(actualPass, expectedObject);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isIn(actualReject, expected));
        });
    });
    describe('check', () => {
        it('guards an array', () => {
            assert.isTrue(check.isIn(actualPass, expected));

            if (check.isIn(actualPass, expected)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('guards on object', () => {
            assert.isTrue(check.isIn(actualPass, expectedObject));

            if (check.isIn(actualPass, expectedObject)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isIn(actualReject, expected));
        });
    });
    describe('assertWrap', () => {
        it('guards an array', () => {
            const newValue = assertWrap.isIn(actualPass, expected);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('guards on object', () => {
            const newValue = assertWrap.isIn(actualPass, expectedObject);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isIn(actualReject, expected));
        });
    });
    describe('checkWrap', () => {
        it('guards an array', () => {
            const newValue = checkWrap.isIn(actualPass, expected);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('guards on object', () => {
            const newValue = checkWrap.isIn(actualPass, expectedObject);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isIn(actualReject, expected));
        });
    });
    describe('waitUntil', () => {
        it('guards an array', async () => {
            const newValue = await waitUntil.isIn(
                expected,
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.deepEquals(actualPass, newValue);
        });
        it('guards on object', async () => {
            const newValue = await waitUntil.isIn(
                expectedObject,
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.deepEquals(actualPass, newValue);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.isIn(expected, () => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});

describe('isEmpty', () => {
    const actualPass = [] as unknown[];
    const actualReject = ['a'];
    type ExpectedType = [];
    type UnexpectedType = unknown[];

    type ExpectedUnionNarrowedType = EmptyObject;
    const actualPassUnion: {a: 'hi'} | ExpectedUnionNarrowedType = {} as any;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isEmpty(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isEmpty(actualReject));
        });
        it('narrows', () => {
            assert.isEmpty(actualPassUnion);

            assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isEmpty(actualPass));

            if (check.isEmpty(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isEmpty(actualReject));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isEmpty(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isEmpty(actualReject));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isEmpty(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isEmpty(actualReject));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isEmpty(
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.deepEquals(actualPass, newValue);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.isEmpty(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});
