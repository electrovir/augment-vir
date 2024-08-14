import {AnyFunction, AnyObject, UnknownObject} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {assertWrap} from '../guards/assert-wrap.js';
import {assert} from '../guards/assert.js';
import {checkWrap} from '../guards/check-wrap.js';
import {check} from '../guards/check.js';
import {waitUntil} from '../guards/wait-until.js';
import {waitUntilTestOptions} from '../test-timeout.mock.js';

describe('isArray', () => {
    const actualPass: unknown = [
        'hi',
        'bye',
    ] as any;
    const actualReject: unknown = 'two' as any;
    type ExpectedType = unknown[];
    type UnexpectedType = unknown;

    type ExpectedUnionNarrowedType = ('hi' | 'bye')[];
    const actualPassUnion: string | ExpectedUnionNarrowedType = ['hi'] as any;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isArray(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isArray(actualReject));
        });
        it('narrows', () => {
            assert.isArray(actualPassUnion);

            assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isArray(actualPass));

            if (check.isArray(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isArray(actualReject));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isArray(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isArray(actualReject));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isArray(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isArray(actualReject));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isArray(
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
                waitUntil.isArray(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});
describe('isNotArray', () => {
    const actualPass: Record<string, string> | string[] = {hi: 'bye'} as any;
    const actualReject: Record<string, string> | string[] = ['two'] as any;
    type ExpectedType = Record<string, string>;
    type UnexpectedType = string[];

    type ExpectedUnionNarrowedType = string;
    const actualPassUnion: ('hi' | 'bye')[] | ExpectedUnionNarrowedType = 'hi' as any;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isNotArray(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotArray(actualReject));
        });
        it('narrows', () => {
            assert.isNotArray(actualPassUnion);

            assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotArray(actualPass));

            if (check.isNotArray(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotArray(actualReject));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotArray(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotArray(actualReject));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotArray(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotArray(actualReject));
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotArray(
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
                waitUntil.isNotArray(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
    });
});

describe('isBigInt', () => {
    const actualPass: unknown = 42n as any;
    const actualReject: unknown = 42 as any;
    type ExpectedType = bigint;
    type UnexpectedType = number;

    type ExpectedUnionNarrowedType = 42n;
    const actualPassUnion: number | ExpectedUnionNarrowedType = 42n as any;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isBigInt(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isBigInt(actualReject));
        });
        it('narrows', () => {
            assert.isBigInt(actualPassUnion);

            assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isBigInt(actualPass));

            if (check.isBigInt(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isBigInt(actualReject));
        });
        it('narrows', () => {
            if (check.isBigInt(actualPassUnion)) {
                assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isBigInt(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isBigInt(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isBigInt(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isBigInt(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isBigInt(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isBigInt(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isBigInt(
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
                waitUntil.isBigInt(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isBigInt(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
});
describe('isNotBigInt', () => {
    const actualPass: bigint | number = 42 as any;
    const actualReject: bigint | number = 42n as any;
    type ExpectedType = number;
    type UnexpectedType = bigint;

    type ExpectedUnionNarrowedType = number;
    const actualPassUnion: 42n | ExpectedUnionNarrowedType = 42 as any;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isNotBigInt(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotBigInt(actualReject));
        });
        it('narrows', () => {
            assert.isNotBigInt(actualPassUnion);

            assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotBigInt(actualPass));

            if (check.isNotBigInt(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotBigInt(actualReject));
        });
        it('narrows', () => {
            if (check.isNotBigInt(actualPassUnion)) {
                assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotBigInt(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotBigInt(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isNotBigInt(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotBigInt(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotBigInt(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isNotBigInt(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotBigInt(
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
                waitUntil.isNotBigInt(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isNotBigInt(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
});

describe('isBoolean', () => {
    const actualPass: unknown = true as any;
    const actualReject: unknown = 'true' as any;
    type ExpectedType = boolean;
    type UnexpectedType = true;

    type ExpectedUnionNarrowedType = true;
    const actualPassUnion: 0 | 1 | ExpectedUnionNarrowedType = true as any;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isBoolean(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isBoolean(actualReject));
        });
        it('narrows', () => {
            assert.isBoolean(actualPassUnion);

            assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isBoolean(actualPass));

            if (check.isBoolean(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isBoolean(actualReject));
        });
        it('narrows', () => {
            if (check.isBoolean(actualPassUnion)) {
                assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isBoolean(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('narrows', () => {
            const newValue = assertWrap.isBoolean(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isBoolean(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isBoolean(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isBoolean(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isBoolean(
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
                waitUntil.isBoolean(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isBoolean(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
});
describe('isNotBoolean', () => {
    const actualPass: boolean | string = 'true' as any;
    const actualReject: boolean | string = true as any;
    type ExpectedType = string;
    type UnexpectedType = boolean;

    type ExpectedUnionNarrowedType = 0 | 1;
    const actualPassUnion: true | ExpectedUnionNarrowedType = 0 as any;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isNotBoolean(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotBoolean(actualReject));
        });
        it('narrows', () => {
            assert.isNotBoolean(actualPassUnion);

            assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotBoolean(actualPass));

            if (check.isNotBoolean(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotBoolean(actualReject));
        });
        it('narrows', () => {
            if (check.isNotBoolean(actualPassUnion)) {
                assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotBoolean(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('narrows', () => {
            const newValue = assertWrap.isNotBoolean(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotBoolean(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotBoolean(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isNotBoolean(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotBoolean(
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
                waitUntil.isNotBoolean(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isNotBoolean(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
});

describe('isFunction', () => {
    const actualPass: unknown = (() => {}) as any;
    const actualReject: unknown = {} as any;
    type ExpectedType = AnyFunction;
    type UnexpectedType = object;

    type ExpectedUnionNarrowedType = () => string;
    const actualPassUnion: AnyObject | ExpectedUnionNarrowedType = (() => 'hi') as any;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isFunction(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isFunction(actualReject));
        });
        it('narrows', () => {
            assert.isFunction(actualPassUnion);

            assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isFunction(actualPass));

            if (check.isFunction(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isFunction(actualReject));
        });
        it('narrows', () => {
            if (check.isFunction(actualPassUnion)) {
                assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isFunction(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isFunction(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isFunction(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isFunction(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isFunction(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isFunction(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isFunction(
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
                waitUntil.isFunction(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isFunction(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
});
describe('isNotFunction', () => {
    const actualPass: AnyFunction | Record<string, string> = {} as any;
    const actualReject: AnyFunction | Record<string, string> = (() => {}) as any;
    type ExpectedType = Record<string, string>;
    type UnexpectedType = AnyFunction;

    type ExpectedUnionNarrowedType = Record<string, string>;
    const actualPassUnion: (() => string) | ExpectedUnionNarrowedType = {} as any;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isNotFunction(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotFunction(actualReject));
        });
        it('narrows', () => {
            assert.isNotFunction(actualPassUnion);

            assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotFunction(actualPass));

            if (check.isNotFunction(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotFunction(actualReject));
        });
        it('narrows', () => {
            if (check.isNotFunction(actualPassUnion)) {
                assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotFunction(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotFunction(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isNotFunction(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotFunction(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotFunction(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isNotFunction(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotFunction(
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
                waitUntil.isNotFunction(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isNotFunction(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
});

describe('isNull', () => {
    const actualPass: unknown = null as any;
    const actualReject: unknown = undefined as any;
    type ExpectedType = null;
    type UnexpectedType = undefined;

    type ExpectedUnionNarrowedType = null;
    const actualPassUnion: undefined | ExpectedUnionNarrowedType = null as any;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isNull(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNull(actualReject));
        });
        it('narrows', () => {
            assert.isNull(actualPassUnion);

            assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNull(actualPass));

            if (check.isNull(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNull(actualReject));
        });
        it('narrows', () => {
            if (check.isNull(actualPassUnion)) {
                assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNull(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNull(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isNull(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNull(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNull(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isNull(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNull(
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
                waitUntil.isNull(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isNull(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
});
describe('isNotNull', () => {
    const actualPass: null | undefined = undefined as any;
    const actualReject: null | undefined = null as any;
    type ExpectedType = undefined;
    type UnexpectedType = null;

    type ExpectedUnionNarrowedType = string;
    const actualPassUnion: null | ExpectedUnionNarrowedType = 'hi' as any;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isNotNull(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotNull(actualReject));
        });
        it('narrows', () => {
            assert.isNotNull(actualPassUnion);

            assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotNull(actualPass));

            if (check.isNotNull(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotNull(actualReject));
        });
        it('narrows', () => {
            if (check.isNotNull(actualPassUnion)) {
                assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotNull(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotNull(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isNotNull(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotNull(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotNull(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isNotNull(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotNull(
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
                waitUntil.isNotNull(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isNotNull(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
});

describe('isNumber', () => {
    const actualPass: unknown = 42 as any;
    const actualReject: unknown = '42' as any;
    type ExpectedType = number;
    type UnexpectedType = string;

    type ExpectedUnionNarrowedType = 42;
    const actualPassUnion: string | ExpectedUnionNarrowedType = 42 as any;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isNumber(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNumber(actualReject));
        });
        it('narrows', () => {
            assert.isNumber(actualPassUnion);

            assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNumber(actualPass));

            if (check.isNumber(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNumber(actualReject));
        });
        it('narrows', () => {
            if (check.isNumber(actualPassUnion)) {
                assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNumber(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNumber(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isNumber(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNumber(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNumber(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isNumber(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNumber(
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
                waitUntil.isNumber(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isNumber(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
});
describe('isNotNumber', () => {
    const actualPass: number | string = '42' as any;
    const actualReject: number | string = 42 as any;
    type ExpectedType = string;
    type UnexpectedType = number;

    type ExpectedUnionNarrowedType = '42';
    const actualPassUnion: 42 | ExpectedUnionNarrowedType = '42' as any;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isNotNumber(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotNumber(actualReject));
        });
        it('narrows', () => {
            assert.isNotNumber(actualPassUnion);

            assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotNumber(actualPass));

            if (check.isNotNumber(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotNumber(actualReject));
        });
        it('narrows', () => {
            if (check.isNotNumber(actualPassUnion)) {
                assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotNumber(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotNumber(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isNotNumber(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotNumber(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotNumber(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isNotNumber(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotNumber(
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
                waitUntil.isNotNumber(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isNotNumber(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
});

describe('isObject', () => {
    const actualPass: unknown = {} as any;
    const actualReject: unknown = [] as any;
    type ExpectedType = UnknownObject;
    type UnexpectedType = unknown[];

    type ExpectedUnionNarrowedType = {hi: string};
    const actualPassUnion: string[] | ExpectedUnionNarrowedType = {hi: 'hello'} as any;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isObject(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isObject(actualReject));
        });
        it('narrows', () => {
            assert.isObject(actualPassUnion);

            assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isObject(actualPass));

            if (check.isObject(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isObject(actualReject));
        });
        it('narrows', () => {
            if (check.isObject(actualPassUnion)) {
                assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isObject(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isObject(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isObject(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isObject(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isObject(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isObject(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isObject(
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
                waitUntil.isObject(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isObject(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
});
describe('isNotObject', () => {
    const actualPass: UnknownObject | unknown[] = [] as any;
    const actualReject: UnknownObject | unknown[] = {} as any;
    type ExpectedType = unknown[];
    type UnexpectedType = UnknownObject;

    type ExpectedUnionNarrowedType = string[];
    const actualPassUnion: {hi: string} | ExpectedUnionNarrowedType = [] as any;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isNotObject(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotObject(actualReject));
        });
        it('narrows', () => {
            assert.isNotObject(actualPassUnion);

            assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotObject(actualPass));

            if (check.isNotObject(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotObject(actualReject));
        });
        it('narrows', () => {
            if (check.isNotObject(actualPassUnion)) {
                assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotObject(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotObject(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isNotObject(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotObject(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotObject(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isNotObject(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotObject(
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
                waitUntil.isNotObject(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isNotObject(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
});

describe('isString', () => {
    const actualPass: unknown = '4' as any;
    const actualReject: unknown = 4 as any;
    type ExpectedType = string;
    type UnexpectedType = number;

    type ExpectedUnionNarrowedType = 'hello';
    const actualPassUnion: 32 | ExpectedUnionNarrowedType = 'hello' as any;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isString(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isString(actualReject));
        });
        it('narrows', () => {
            assert.isString(actualPassUnion);

            assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isString(actualPass));

            if (check.isString(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isString(actualReject));
        });
        it('narrows', () => {
            if (check.isString(actualPassUnion)) {
                assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isString(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isString(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isString(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isString(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isString(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isString(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isString(
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
                waitUntil.isString(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isString(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
});
describe('isNotString', () => {
    const actualPass: string | number = 4 as any;
    const actualReject: string | number = '4' as any;
    type ExpectedType = number;
    type UnexpectedType = string;

    type ExpectedUnionNarrowedType = 32;
    const actualPassUnion: 'hello' | ExpectedUnionNarrowedType = 32 as any;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isNotString(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotString(actualReject));
        });
        it('narrows', () => {
            assert.isNotString(actualPassUnion);

            assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotString(actualPass));

            if (check.isNotString(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotString(actualReject));
        });
        it('narrows', () => {
            if (check.isNotString(actualPassUnion)) {
                assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotString(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotString(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isNotString(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotString(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotString(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isNotString(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotString(
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
                waitUntil.isNotString(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isNotString(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
});

describe('isSymbol', () => {
    const actualPass: unknown = Symbol('4') as any;
    const actualReject: unknown = '4' as any;
    type ExpectedType = symbol;
    type UnexpectedType = string;

    const passUnionSymbol = Symbol('hi');
    type ExpectedUnionNarrowedType = Readonly<typeof passUnionSymbol>;
    const actualPassUnion: 'hi' | ExpectedUnionNarrowedType = passUnionSymbol as any;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isSymbol(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isSymbol(actualReject));
        });
        it('narrows', () => {
            assert.isSymbol(actualPassUnion);

            assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isSymbol(actualPass));

            if (check.isSymbol(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isSymbol(actualReject));
        });
        it('narrows', () => {
            if (check.isSymbol(actualPassUnion)) {
                assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isSymbol(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isSymbol(actualReject));
        });
        it('narrows', () => {
            /**
             * Assigning the symbol to another variable kills its `unique` attribute. However,
             * checkWrap does not have this problem for some reason.
             */
            const reAssignment = passUnionSymbol;

            assert.typeOf(reAssignment).not.toEqualTypeOf<ExpectedUnionNarrowedType>();
            assert.typeOf(reAssignment).toBeSymbol();

            /** However, if you don't assign it to a separate variable, the symbol remains unique. */
            assert
                .typeOf(assertWrap.isSymbol(actualPassUnion))
                .toEqualTypeOf<ExpectedUnionNarrowedType>();

            const newValue = assertWrap.isSymbol(actualPassUnion);
            /** TS won't let us narrow the union here, as explained above. */
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedUnionNarrowedType>();
            assert.typeOf(newValue).toBeSymbol();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isSymbol(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isSymbol(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isSymbol(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isSymbol(
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
                waitUntil.isSymbol(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isSymbol(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            /** TS won't let us narrow the union here. */
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedUnionNarrowedType>();
            assert.typeOf(newValue).toBeSymbol();
        });
    });
});
describe('isNotSymbol', () => {
    const actualPass: symbol | string = '4' as any;
    const actualReject: symbol | string = Symbol('4') as any;
    type ExpectedType = string;
    type UnexpectedType = symbol;

    const unionSymbol = Symbol('hi');
    type ExpectedUnionNarrowedType = 'hi';
    const actualPassUnion: Readonly<typeof unionSymbol> | ExpectedUnionNarrowedType = 'hi' as any;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isNotSymbol(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotSymbol(actualReject));
        });
        it('narrows', () => {
            assert.isNotSymbol(actualPassUnion);

            assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotSymbol(actualPass));

            if (check.isNotSymbol(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotSymbol(actualReject));
        });
        it('narrows', () => {
            if (check.isNotSymbol(actualPassUnion)) {
                assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotSymbol(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotSymbol(actualReject));
        });
        it('narrows', () => {
            const reAssignment = unionSymbol;

            assert.typeOf(reAssignment).not.toEqualTypeOf<ExpectedUnionNarrowedType>();
            assert.typeOf(reAssignment).toBeSymbol();

            assert
                .typeOf(assertWrap.isNotSymbol(actualPassUnion))
                .toEqualTypeOf<ExpectedUnionNarrowedType>();

            const newValue = assertWrap.isNotSymbol(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotSymbol(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotSymbol(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isNotSymbol(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotSymbol(
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
                waitUntil.isNotSymbol(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isNotSymbol(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
});

describe('isUndefined', () => {
    const actualPass: unknown = undefined as any;
    const actualReject: unknown = null as any;
    type ExpectedType = undefined;
    type UnexpectedType = null;

    type ExpectedUnionNarrowedType = undefined;
    const actualPassUnion: null | false | ExpectedUnionNarrowedType = undefined as any;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isUndefined(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isUndefined(actualReject));
        });
        it('narrows', () => {
            assert.isUndefined(actualPassUnion);

            assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isUndefined(actualPass));

            if (check.isUndefined(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isUndefined(actualReject));
        });
        it('narrows', () => {
            if (check.isUndefined(actualPassUnion)) {
                assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isUndefined(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isUndefined(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isUndefined(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('does not exist', () => {
            // @ts-expect-error: checkWrap.isUndefined does not exist
            assert.isUndefined(checkWrap.isUndefined);
            checkWrap;
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isUndefined(
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
                waitUntil.isUndefined(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isUndefined(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
});
describe('isNotUndefined', () => {
    const actualPass: undefined | null = null as any;
    const actualReject: undefined | null = undefined as any;
    type ExpectedType = null;
    type UnexpectedType = undefined;

    type ExpectedUnionNarrowedType = null | false;
    const actualPassUnion: undefined | ExpectedUnionNarrowedType = null as any;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isNotUndefined(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotUndefined(actualReject));
        });
        it('narrows', () => {
            assert.isNotUndefined(actualPassUnion);

            assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotUndefined(actualPass));

            if (check.isNotUndefined(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotUndefined(actualReject));
        });
        it('narrows', () => {
            if (check.isNotUndefined(actualPassUnion)) {
                assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotUndefined(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotUndefined(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isNotUndefined(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('does not exist', () => {
            // @ts-expect-error: checkWrap.isNotUndefined does not exist
            assert.isUndefined(checkWrap.isNotUndefined);
            checkWrap;
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotUndefined(
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
                waitUntil.isNotUndefined(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isNotUndefined(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
});
