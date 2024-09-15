import type {
    AnyFunction,
    AnyObject,
    JsonCompatibleArray,
    JsonCompatibleObject,
    JsonCompatibleValue,
    UnknownObject,
} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {assertWrap} from '../augments/guards/assert-wrap.js';
import {assert} from '../augments/guards/assert.js';
import {checkWrap} from '../augments/guards/check-wrap.js';
import {check} from '../augments/guards/check.js';
import {waitUntil} from '../augments/guards/wait-until.js';
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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isArray(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isArray(actualReject));
        });
        it('narrows', () => {
            assert.isArray(actualPassUnion);

            assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
        });
        it('narrows readonly', () => {
            const value: string | ReadonlyArray<string> = [] as any;
            assert.isArray(value);
            assert.tsType(value).equals<ReadonlyArray<string>>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isArray(actualPass));

            if (check.isArray(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isArray(actualReject));
        });
        it('narrows', () => {
            if (check.isArray(actualPassUnion)) {
                assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
            }
        });
        it('narrows readonly', () => {
            const value: string | ReadonlyArray<string> = [] as any;

            if (check.isArray(value)) {
                assert.tsType(value).equals<ReadonlyArray<string>>();
            }
        });
        it('narrows to writable first', () => {
            const value: JsonCompatibleObject | JsonCompatibleArray = [] as any;

            if (check.isArray(value)) {
                assert.tsType(value).equals<JsonCompatibleValue[]>();
                value.push('something');
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isArray(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isArray(actualReject));
        });
        it('narrows readonly', () => {
            const value: string | ReadonlyArray<string> = [] as any;
            const checked = assertWrap.isArray(value);
            assert.tsType(checked).equals<ReadonlyArray<string>>();
            assert.deepEquals(checked, []);
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isArray(actualPass);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isArray(actualReject));
        });
        it('narrows readonly', () => {
            const value: string | ReadonlyArray<string> = [] as any;
            const checked = checkWrap.isArray(value);
            assert.isDefined(checked);
            assert.tsType(checked).equals<ReadonlyArray<string>>();
            assert.deepEquals(checked, []);
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isArray(
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
                waitUntil.isArray(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows readonly', async () => {
            const value: string | ReadonlyArray<string> = [] as any;

            const newValue = await waitUntil.isArray(() => value, waitUntilTestOptions, 'failure');

            assert.tsType(newValue).equals<ReadonlyArray<string>>();

            assert.deepEquals(value, newValue);
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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isNotArray(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotArray(actualReject));
        });
        it('narrows', () => {
            assert.isNotArray(actualPassUnion);

            assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotArray(actualPass));

            if (check.isNotArray(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotArray(actualReject));
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotArray(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotArray(actualReject));
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotArray(actualPass);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
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

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();

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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isBigInt(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isBigInt(actualReject));
        });
        it('narrows', () => {
            assert.isBigInt(actualPassUnion);

            assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isBigInt(actualPass));

            if (check.isBigInt(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isBigInt(actualReject));
        });
        it('narrows', () => {
            if (check.isBigInt(actualPassUnion)) {
                assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isBigInt(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isBigInt(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isBigInt(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isBigInt(actualPass);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isBigInt(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isBigInt(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isBigInt(
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
                waitUntil.isBigInt(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isBigInt(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isNotBigInt(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotBigInt(actualReject));
        });
        it('narrows', () => {
            assert.isNotBigInt(actualPassUnion);

            assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotBigInt(actualPass));

            if (check.isNotBigInt(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotBigInt(actualReject));
        });
        it('narrows', () => {
            if (check.isNotBigInt(actualPassUnion)) {
                assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotBigInt(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotBigInt(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isNotBigInt(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotBigInt(actualPass);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotBigInt(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isNotBigInt(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotBigInt(
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
                waitUntil.isNotBigInt(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isNotBigInt(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isBoolean(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isBoolean(actualReject));
        });
        it('narrows', () => {
            assert.isBoolean(actualPassUnion);

            assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isBoolean(actualPass));

            if (check.isBoolean(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isBoolean(actualReject));
        });
        it('narrows', () => {
            if (check.isBoolean(actualPassUnion)) {
                assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isBoolean(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('narrows', () => {
            const newValue = assertWrap.isBoolean(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isBoolean(actualPass);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isBoolean(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isBoolean(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isBoolean(
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
                waitUntil.isBoolean(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isBoolean(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isNotBoolean(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotBoolean(actualReject));
        });
        it('narrows', () => {
            assert.isNotBoolean(actualPassUnion);

            assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotBoolean(actualPass));

            if (check.isNotBoolean(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotBoolean(actualReject));
        });
        it('narrows', () => {
            if (check.isNotBoolean(actualPassUnion)) {
                assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotBoolean(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('narrows', () => {
            const newValue = assertWrap.isNotBoolean(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotBoolean(actualPass);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotBoolean(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isNotBoolean(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotBoolean(
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
                waitUntil.isNotBoolean(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isNotBoolean(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isFunction(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isFunction(actualReject));
        });
        it('narrows', () => {
            assert.isFunction(actualPassUnion);

            assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isFunction(actualPass));

            if (check.isFunction(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isFunction(actualReject));
        });
        it('narrows', () => {
            if (check.isFunction(actualPassUnion)) {
                assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isFunction(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isFunction(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isFunction(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isFunction(actualPass);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isFunction(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isFunction(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isFunction(
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
                waitUntil.isFunction(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isFunction(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isNotFunction(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotFunction(actualReject));
        });
        it('narrows', () => {
            assert.isNotFunction(actualPassUnion);

            assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotFunction(actualPass));

            if (check.isNotFunction(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotFunction(actualReject));
        });
        it('narrows', () => {
            if (check.isNotFunction(actualPassUnion)) {
                assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotFunction(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotFunction(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isNotFunction(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotFunction(actualPass);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotFunction(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isNotFunction(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotFunction(
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
                waitUntil.isNotFunction(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isNotFunction(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isNull(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNull(actualReject));
        });
        it('narrows', () => {
            assert.isNull(actualPassUnion);

            assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNull(actualPass));

            if (check.isNull(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNull(actualReject));
        });
        it('narrows', () => {
            if (check.isNull(actualPassUnion)) {
                assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNull(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNull(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isNull(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNull(actualPass);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNull(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isNull(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNull(
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
                waitUntil.isNull(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isNull(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isNotNull(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotNull(actualReject));
        });
        it('narrows', () => {
            assert.isNotNull(actualPassUnion);

            assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotNull(actualPass));

            if (check.isNotNull(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotNull(actualReject));
        });
        it('narrows', () => {
            if (check.isNotNull(actualPassUnion)) {
                assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotNull(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotNull(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isNotNull(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotNull(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotNull(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isNotNull(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotNull(
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
                waitUntil.isNotNull(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isNotNull(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isNumber(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNumber(actualReject));
        });
        it('narrows', () => {
            assert.isNumber(actualPassUnion);

            assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
        });
        it('blocks NaN', () => {
            assert.throws(() => assert.isNumber(NaN));
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNumber(actualPass));

            if (check.isNumber(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNumber(actualReject));
        });
        it('narrows', () => {
            if (check.isNumber(actualPassUnion)) {
                assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNumber(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNumber(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isNumber(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNumber(actualPass);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNumber(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isNumber(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNumber(
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
                waitUntil.isNumber(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isNumber(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isNotNumber(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotNumber(actualReject));
        });
        it('narrows', () => {
            assert.isNotNumber(actualPassUnion);

            assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotNumber(actualPass));

            if (check.isNotNumber(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotNumber(actualReject));
        });
        it('narrows', () => {
            if (check.isNotNumber(actualPassUnion)) {
                assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotNumber(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotNumber(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isNotNumber(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotNumber(actualPass);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotNumber(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isNotNumber(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotNumber(
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
                waitUntil.isNotNumber(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isNotNumber(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isObject(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isObject(actualReject));
        });
        it('narrows', () => {
            assert.isObject(actualPassUnion);

            assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isObject(actualPass));

            if (check.isObject(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isObject(actualReject));
        });
        it('narrows', () => {
            if (check.isObject(actualPassUnion)) {
                assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isObject(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isObject(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isObject(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isObject(actualPass);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isObject(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isObject(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isObject(
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
                waitUntil.isObject(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isObject(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isNotObject(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotObject(actualReject));
        });
        it('narrows', () => {
            assert.isNotObject(actualPassUnion);

            assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotObject(actualPass));

            if (check.isNotObject(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotObject(actualReject));
        });
        it('narrows', () => {
            if (check.isNotObject(actualPassUnion)) {
                assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotObject(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotObject(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isNotObject(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotObject(actualPass);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotObject(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isNotObject(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotObject(
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
                waitUntil.isNotObject(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isNotObject(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isString(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isString(actualReject));
        });
        it('narrows', () => {
            assert.isString(actualPassUnion);

            assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isString(actualPass));

            if (check.isString(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isString(actualReject));
        });
        it('narrows', () => {
            if (check.isString(actualPassUnion)) {
                assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isString(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isString(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isString(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isString(actualPass);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isString(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isString(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isString(
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
                waitUntil.isString(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isString(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isNotString(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotString(actualReject));
        });
        it('narrows', () => {
            assert.isNotString(actualPassUnion);

            assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotString(actualPass));

            if (check.isNotString(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotString(actualReject));
        });
        it('narrows', () => {
            if (check.isNotString(actualPassUnion)) {
                assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotString(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotString(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isNotString(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotString(actualPass);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotString(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isNotString(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotString(
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
                waitUntil.isNotString(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isNotString(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isSymbol(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isSymbol(actualReject));
        });
        it('narrows', () => {
            assert.isSymbol(actualPassUnion);

            assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isSymbol(actualPass));

            if (check.isSymbol(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isSymbol(actualReject));
        });
        it('narrows', () => {
            if (check.isSymbol(actualPassUnion)) {
                assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isSymbol(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
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

            assert.tsType(reAssignment).notEquals<ExpectedUnionNarrowedType>();
            assert.tsType(reAssignment).equals<symbol>();

            /** However, if you don't assign it to a separate variable, the symbol remains unique. */
            assert.tsType(assertWrap.isSymbol(actualPassUnion)).equals<ExpectedUnionNarrowedType>();

            const newValue = assertWrap.isSymbol(actualPassUnion);
            /** TS won't let us narrow the union here, as explained above. */
            assert.tsType(newValue).notEquals<ExpectedUnionNarrowedType>();
            assert.tsType(newValue).equals<symbol>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isSymbol(actualPass);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isSymbol(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isSymbol(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isSymbol(
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
            assert.tsType(newValue).notEquals<ExpectedUnionNarrowedType>();
            assert.tsType(newValue).equals<symbol>();
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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isNotSymbol(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotSymbol(actualReject));
        });
        it('narrows', () => {
            assert.isNotSymbol(actualPassUnion);

            assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotSymbol(actualPass));

            if (check.isNotSymbol(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotSymbol(actualReject));
        });
        it('narrows', () => {
            if (check.isNotSymbol(actualPassUnion)) {
                assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotSymbol(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotSymbol(actualReject));
        });
        it('narrows', () => {
            const reAssignment = unionSymbol;

            assert.tsType(reAssignment).notEquals<ExpectedUnionNarrowedType>();
            assert.tsType(reAssignment).equals<symbol>();

            assert
                .tsType(assertWrap.isNotSymbol(actualPassUnion))
                .equals<ExpectedUnionNarrowedType>();

            const newValue = assertWrap.isNotSymbol(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotSymbol(actualPass);

            assert.tsType(newValue).equals<ExpectedType | undefined>();
            assert.tsType(newValue).notEquals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotSymbol(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isNotSymbol(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotSymbol(
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
                waitUntil.isNotSymbol(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isNotSymbol(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isUndefined(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isUndefined(actualReject));
        });
        it('narrows', () => {
            assert.isUndefined(actualPassUnion);

            assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isUndefined(actualPass));

            if (check.isUndefined(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isUndefined(actualReject));
        });
        it('narrows', () => {
            if (check.isUndefined(actualPassUnion)) {
                assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isUndefined(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isUndefined(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isUndefined(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
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

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();

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

            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
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
            assert.tsType(actualPass).notEquals<ExpectedType>();

            assert.isNotUndefined(actualPass);

            assert.tsType(actualPass).equals<ExpectedType>();
            assert.tsType(actualPass).notEquals<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotUndefined(actualReject));
        });
        it('narrows', () => {
            assert.isNotUndefined(actualPassUnion);

            assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotUndefined(actualPass));

            if (check.isNotUndefined(actualPass)) {
                assert.tsType(actualPass).equals<ExpectedType>();
                assert.tsType(actualPass).notEquals<UnexpectedType>();
            }

            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isNotUndefined(actualReject));
        });
        it('narrows', () => {
            if (check.isNotUndefined(actualPassUnion)) {
                assert.tsType(actualPassUnion).equals<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotUndefined(actualPass);

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assertWrap.isNotUndefined(actualReject));
        });
        it('narrows', () => {
            const newValue = assertWrap.isNotUndefined(actualPassUnion);
            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
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

            assert.tsType(newValue).equals<ExpectedType>();
            assert.tsType(newValue).notEquals<UnexpectedType>();
            assert.tsType(actualPass).notEquals<ExpectedType>();

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

            assert.tsType(newValue).equals<ExpectedUnionNarrowedType>();
        });
    });
});
