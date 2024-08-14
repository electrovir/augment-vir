import {MaybePromise} from '@augment-vir/core';
import JSON5 from 'json5';
import {Constructor} from 'type-fest';
import {AssertionError} from '../assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {WaitUntilOptions} from '../guard-types/wait-until-function.js';

/** Wraps the JavaScript built-in "instanceof" in a type guard assertion. */
function instanceOf<const Instance>(
    instance: unknown,
    /** The constructor that the "instance" input will be checked against. */
    constructor: Constructor<Instance>,
    /** Message to include in error message if this assertion fails. */
    failureMessage?: string | undefined,
): asserts instance is Instance {
    if (!(instance instanceof constructor)) {
        throw new AssertionError(
            failureMessage ||
                `'${JSON5.stringify(instance)}' is not an instance of '${constructor.name}'`,
        );
    }
}
function notInstanceOf<const Actual, const Instance>(
    instance: Actual,
    constructor: Constructor<Instance>,
    failureMessage?: string | undefined,
): asserts instance is Exclude<Actual, Instance> {
    if (instance instanceof constructor) {
        throw new AssertionError(
            failureMessage ||
                `'${JSON5.stringify(instance)}' is an instance of '${constructor.name}'`,
        );
    }
}

const assertions: {
    instanceOf: typeof instanceOf;
    notInstanceOf: typeof notInstanceOf;
} = {
    instanceOf,
    notInstanceOf,
};

export const instanceGuards = {
    assertions,
    checkOverrides: {
        instanceOf:
            autoGuard<
                <const Instance>(
                    instance: unknown,
                    constructor: Constructor<Instance>,
                ) => instance is Instance
            >(),
        notInstanceOf:
            autoGuard<
                <const Actual, const Instance>(
                    instance: Actual,
                    constructor: Constructor<Instance>,
                ) => instance is Exclude<Actual, Instance>
            >(),
    },
    assertWrapOverrides: {
        instanceOf:
            autoGuard<
                <const Instance>(
                    instance: unknown,
                    constructor: Constructor<Instance>,
                    failureMessage?: string | undefined,
                ) => Instance
            >(),
        notInstanceOf:
            autoGuard<
                <const Actual, const Instance>(
                    instance: Actual,
                    constructor: Constructor<Instance>,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, Instance>
            >(),
    },
    checkWrapOverrides: {
        instanceOf:
            autoGuard<
                <const Instance>(
                    instance: unknown,
                    constructor: Constructor<Instance>,
                ) => Instance | undefined
            >(),
        notInstanceOf:
            autoGuard<
                <const Actual, const Instance>(
                    instance: Actual,
                    constructor: Constructor<Instance>,
                ) => Exclude<Actual, Instance> | undefined
            >(),
    },
    waitUntilOverrides: {
        instanceOf:
            autoGuard<
                <const Instance>(
                    constructor: Constructor<Instance>,
                    callback: () => MaybePromise<unknown>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Instance>
            >(),
        notInstanceOf:
            autoGuard<
                <const Actual, const Instance>(
                    constructor: Constructor<Instance>,
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, Instance>>
            >(),
    },
} satisfies GuardGroup;
