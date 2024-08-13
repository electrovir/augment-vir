/* eslint-disable @typescript-eslint/unified-signatures */
import {Overwrite} from '@augment-vir/core';
import type {ExpectTypeOf, Not} from 'expect-type';

type ExtraTypeChecks<TestingType, B extends boolean> = {
    toBeAssignableTo: ExpectTypeOf<TestingType, B>['toMatchTypeOf'];
};

type WithExtraNotTypeChecks<TestingType, B extends boolean> = Overwrite<
    ExpectTypeOf<TestingType, B>,
    {
        not: ExpectTypeOf<TestingType, B>['not'] & ExtraTypeChecks<TestingType, Not<B>>;
    }
>;

type AssertTypeOf<TestingType, B extends boolean> = WithExtraNotTypeChecks<TestingType, B> &
    ExtraTypeChecks<TestingType, B>;

/**
 * Uses the expect-type package to assert type matching. Does not actually do anything at run-time
 * (like throwing errors).
 */
function typeOf<TestingType>(
    /** Run-time value to type check. */
    input: TestingType,
): AssertTypeOf<TestingType, true>;
/** Uses the expect-type package to assert type matching. */
function typeOf<TestingType>(): AssertTypeOf<TestingType, true>;
/** Uses the expect-type package to assert type matching. */
function typeOf<TestingType>(
    /** Run-time value to type check. */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    input?: TestingType,
): AssertTypeOf<TestingType, true> {
    // run time implementation for this doesn't matter
    const runtimeProxy = new Proxy(
        {},
        {
            get: (target, property) => {
                if (property === 'not') {
                    return runtimeProxy;
                }
                return () => true;
            },
        },
    ) as any;

    return runtimeProxy;
}

export const typeofAssertions: {
    typeOf: typeof typeOf;
} = {
    /**
     * Used for TypeScript-only type checking. Make sure to chain it with something like
     * `toEqualTypeOf`.
     *
     * @example
     *     assert.typeOf<MyType>().toEqualTypeOf<string>();
     */
    typeOf,
};
