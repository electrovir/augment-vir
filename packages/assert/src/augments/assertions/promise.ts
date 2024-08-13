import JSON5 from 'json5';
import {hasProperty} from 'run-time-assertions';
import {AssertionError} from '../assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {createWaitUntil, WaitUntilOptions} from '../guard-types/wait-until-function.js';

function isPromiseLike(
    input: unknown,
    failureMessage?: string | undefined,
): asserts input is PromiseLike<any> {
    if (
        !(input instanceof Promise) &&
        !(hasProperty(input, 'then') && typeof input.then === 'function')
    ) {
        throw new AssertionError(
            failureMessage || `'${JSON5.stringify(input)}' is not a PromiseLike.`,
        );
    }
}

/**
 * Checks if a value is an actual `Promise` object. In reality this is just a simple wrapper for
 * `instanceof Promise`, but it makes checking a bit more ergonomic.
 */
function isPromise(
    input: unknown,
    failureMessage?: string | undefined,
): asserts input is Promise<any> {
    if (!(input instanceof Promise)) {
        throw new AssertionError(failureMessage || `'${JSON5.stringify(input)}' is not a Promise.`);
    }
}

const assertions: {
    isPromiseLike: typeof isPromiseLike;
    isPromise: typeof isPromise;
} = {
    isPromiseLike,
    isPromise,
};

export const promiseGuards = {
    assertions,
    assertWrapOverrides: {
        isPromise:
            autoGuard<
                <const Actual>(
                    input: Actual,
                    failureMessage?: string | undefined,
                ) => Extract<Actual, Promise<any>>
            >(),
        isPromiseLike:
            autoGuard<
                <const Actual>(
                    input: Actual,
                    failureMessage?: string | undefined,
                ) => Extract<Actual, PromiseLike<any>>
            >(),
    },
    waitUntilOverrides: {
        isPromise: createWaitUntil(isPromise, true) as <const Actual>(
            callback: () => Actual,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Extract<Actual, Promise<any>>>,
        isPromiseLike: createWaitUntil(isPromiseLike, true) as <const Actual>(
            callback: () => Actual,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Extract<Actual, PromiseLike<any>>>,
    },
} satisfies GuardGroup;

export function isPromiseLike2(input: any): any {
    return input;
}
