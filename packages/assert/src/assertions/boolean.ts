import {MaybePromise, NarrowToExpected, stringify} from '@augment-vir/core';
import {AssertionError} from '../augments/assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {WaitUntilOptions} from '../guard-types/wait-until-function.js';

// eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
export type FalsyValue = undefined | null | false | 0 | '' | -0 | 0n;
export type Falsy<T> = NarrowToExpected<T, FalsyValue>;
export type Truthy<T> = Exclude<T, FalsyValue>;

function isFalsy(input: unknown, failureMessage?: string | undefined): asserts input is FalsyValue {
    if (input) {
        throw new AssertionError(`'${stringify(input)}' is not truthy.`, failureMessage);
    }
}

function isTruthy<const Actual>(
    input: Actual,
    failureMessage?: string | undefined,
): asserts input is Truthy<Actual> {
    if (!input) {
        throw new AssertionError(`'${stringify(input)}' is not truthy.`, failureMessage);
    }
}

function isTrue(input: unknown, failureMessage?: string | undefined): asserts input is true {
    if (input !== true) {
        throw new AssertionError(`'${stringify(input)}' is not true.`, failureMessage);
    }
}

function isFalse(input: unknown, failureMessage?: string | undefined): asserts input is false {
    if (input !== false) {
        throw new AssertionError(`'${stringify(input)}' is not false.`, failureMessage);
    }
}

const assertions: {
    isFalsy: typeof isFalsy;
    isTruthy: typeof isTruthy;
    isTrue: typeof isTrue;
    isFalse: typeof isFalse;
} = {
    isFalsy,
    isTruthy,
    isTrue,
    isFalse,
};

export const booleanGuards = {
    assertions,
    checkOverrides: {
        isTruthy: autoGuard<<T>(input: T) => input is Truthy<T>>(),
    },
    assertWrapOverrides: {
        isFalsy: autoGuard<<T>(input: T, failureMessage?: string | undefined) => Falsy<T>>(),
        isTruthy: autoGuard<<T>(input: T, failureMessage?: string | undefined) => Truthy<T>>(),
    },
    checkWrapOverrides: {
        isFalsy: autoGuard<<T>(input: T) => Falsy<T> | undefined>(),
        isTruthy: autoGuard<<T>(input: T) => Truthy<T> | undefined>(),
    },
    waitUntilOverrides: {
        isFalsy:
            autoGuard<
                <Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Falsy<Actual>>
            >(),
        isTruthy:
            autoGuard<
                <Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Truthy<Actual>>
            >(),
    },
} satisfies GuardGroup;
