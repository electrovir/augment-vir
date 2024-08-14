import JSON5 from 'json5';
import {hasProperty} from 'run-time-assertions';
import {AssertionError} from '../assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {createWaitUntil, WaitUntilOptions} from '../guard-types/wait-until-function.js';

function isPromiseLike(
    actual: unknown,
    failureMessage?: string | undefined,
): asserts actual is PromiseLike<any> {
    if (
        !(actual instanceof Promise) &&
        !(hasProperty(actual, 'then') && typeof actual.then === 'function')
    ) {
        throw new AssertionError(
            `'${JSON5.stringify(actual)}' is not a PromiseLike.`,
            failureMessage,
        );
    }
}
function isNotPromiseLike<const Actual>(
    actual: Actual,
    failureMessage?: string | undefined,
): asserts actual is Exclude<Actual, PromiseLike<any>> {
    try {
        isPromiseLike(actual);
    } catch {
        return;
    }

    throw new AssertionError(`'${JSON5.stringify(actual)}' is a PromiseLike.`, failureMessage);
}

/**
 * Checks if a value is an actual `Promise` object. In reality this is just a simple wrapper for
 * `instanceof Promise`, but it makes checking a bit more ergonomic.
 */
function isPromise(
    actual: unknown,
    failureMessage?: string | undefined,
): asserts actual is Promise<any> {
    if (!(actual instanceof Promise)) {
        throw new AssertionError(`'${JSON5.stringify(actual)}' is not a Promise.`, failureMessage);
    }
}
function isNotPromise<const Actual>(
    actual: Actual,
    failureMessage?: string | undefined,
): asserts actual is Exclude<Actual, Promise<any>> {
    if (actual instanceof Promise) {
        throw new AssertionError(`'${JSON5.stringify(actual)}' is a Promise.`, failureMessage);
    }
}

const assertions: {
    isPromiseLike: typeof isPromiseLike;
    isNotPromiseLike: typeof isNotPromiseLike;
    isPromise: typeof isPromise;
    isNotPromise: typeof isNotPromise;
} = {
    isPromiseLike,
    isNotPromiseLike,
    isPromise,
    isNotPromise,
};

export const promiseGuards = {
    assertions,
    checkOverrides: {
        isNotPromise:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is Exclude<Actual, Promise<any>>
            >(),
        isNotPromiseLike:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is Exclude<Actual, PromiseLike<any>>
            >(),
    },
    assertWrapOverrides: {
        isPromise:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Extract<Actual, Promise<any>>
            >(),
        isNotPromise:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, Promise<any>>
            >(),
        isPromiseLike:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Extract<Actual, PromiseLike<any>>
            >(),
        isNotPromiseLike:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, PromiseLike<any>>
            >(),
    },
    checkWrapOverrides: {
        isNotPromise:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, Promise<any>> | undefined
            >(),
        isNotPromiseLike:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, PromiseLike<any>> | undefined
            >(),
    },
    /**
     * These overrides must explicitly use `createWaitUntil` so they can pass in `true` for the
     * second parameter, `requireSynchronousResult`.
     */
    waitUntilOverrides: {
        isPromise: createWaitUntil(isPromise, true) as <const Actual>(
            callback: () => Actual,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Extract<Actual, Promise<any>>>,
        isNotPromise: createWaitUntil(isNotPromise, true) as <const Actual>(
            callback: () => Actual,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Exclude<Actual, Promise<any>>>,
        isPromiseLike: createWaitUntil(isPromiseLike, true) as <const Actual>(
            callback: () => Actual,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Extract<Actual, PromiseLike<any>>>,
        isNotPromiseLike: createWaitUntil(isNotPromiseLike, true) as <const Actual>(
            callback: () => Actual,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Exclude<Actual, PromiseLike<any>>>,
    },
} satisfies GuardGroup;
