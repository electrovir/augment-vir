import {createUuid, type UuidV4} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {assertWrap} from '../guards/assert-wrap.js';
import {assert} from '../guards/assert.js';
import {checkWrap} from '../guards/check-wrap.js';
import {check} from '../guards/check.js';
import {waitUntil} from '../guards/wait-until.js';
import {waitUntilTestOptions} from '../test-timeout.mock.js';

describe('isUuid', () => {
    const actualPass: unknown = createUuid() as any;
    const actualReject: unknown = (createUuid() + 'invalid') as any;
    type ExpectedType = UuidV4;
    type UnexpectedType = string;

    type ExpectedUnionNarrowedType = UuidV4;
    const actualPassUnion: 'hi' | ExpectedUnionNarrowedType = createUuid() as any;

    describe('assert', () => {
        it('guards', () => {
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();

            assert.isUuid(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isUuid(actualReject));
        });
        it('narrows', () => {
            assert.isUuid(actualPassUnion);

            assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isUuid(actualPass));

            if (check.isUuid(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }

            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isFalse(check.isUuid(actualReject));
        });
        it('narrows', () => {
            if (check.isUuid(actualPassUnion)) {
                assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isUuid(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('narrows', () => {
            const newValue = assertWrap.isUuid(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isUuid(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<ExpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isUuid(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isUuid(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isUuid(
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
                waitUntil.isUuid(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isUuid(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
});
describe('isNotUuid', () => {
    const actualPass: string = (createUuid() + 'invalid') as any;
    const actualReject: string = createUuid() as any;
    type ExpectedType = string;
    type UnexpectedType = UuidV4;

    type ExpectedUnionNarrowedType = 'hi';
    const actualPassUnion: UuidV4 | ExpectedUnionNarrowedType = (createUuid() + 'invalid') as any;

    describe('assert', () => {
        it('guards', () => {
            assert.isNotUuid(actualPass);

            assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
            assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.throws(() => assert.isNotUuid(actualReject));
        });
        it('narrows', () => {
            assert.isNotUuid(actualPassUnion);

            assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('check', () => {
        it('guards', () => {
            assert.isTrue(check.isNotUuid(actualPass));

            if (check.isNotUuid(actualPass)) {
                assert.typeOf(actualPass).toEqualTypeOf<ExpectedType>();
                assert.typeOf(actualPass).not.toEqualTypeOf<UnexpectedType>();
            }
        });
        it('rejects', () => {
            assert.isFalse(check.isNotUuid(actualReject));
        });
        it('narrows', () => {
            if (check.isNotUuid(actualPassUnion)) {
                assert.typeOf(actualPassUnion).toEqualTypeOf<ExpectedUnionNarrowedType>();
            }
        });
    });
    describe('assertWrap', () => {
        it('guards', () => {
            const newValue = assertWrap.isNotUuid(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
        });
        it('narrows', () => {
            const newValue = assertWrap.isNotUuid(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
    describe('checkWrap', () => {
        it('guards', () => {
            const newValue = checkWrap.isNotUuid(actualPass);

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType | undefined>();
            assert.typeOf(newValue).not.toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();
        });
        it('rejects', () => {
            assert.isUndefined(checkWrap.isNotUuid(actualReject));
        });
        it('narrows', () => {
            const newValue = checkWrap.isNotUuid(actualPassUnion);
            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType | undefined>();
        });
    });
    describe('waitUntil', () => {
        it('guards', async () => {
            const newValue = await waitUntil.isNotUuid(
                () => actualPass,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedType>();
            assert.typeOf(newValue).not.toEqualTypeOf<UnexpectedType>();

            assert.deepEquals(actualPass, newValue);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.isNotUuid(() => actualReject, waitUntilTestOptions, 'failure'),
            );
        });
        it('narrows', async () => {
            const newValue = await waitUntil.isNotUuid(
                () => actualPassUnion,
                waitUntilTestOptions,
                'failure',
            );

            assert.typeOf(newValue).toEqualTypeOf<ExpectedUnionNarrowedType>();
        });
    });
});
