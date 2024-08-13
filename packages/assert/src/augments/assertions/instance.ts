import JSON5 from 'json5';
import {Constructor} from 'type-fest';
import {AssertionError} from '../assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {WaitUntilOptions} from '../guard-types/wait-until-function.js';

/** Wraps the JavaScript built-in "instanceof" in a type guard assertion. */
function instanceOf<InstanceType>(
    instance: unknown,
    /** The constructor that the "instance" input will be checked against. */
    constructor: Constructor<InstanceType>,
    /** Message to include in error message if this assertion fails. */
    failureMessage?: string | undefined,
): asserts instance is InstanceType {
    if (!(instance instanceof constructor)) {
        throw new AssertionError(
            failureMessage ||
                `'${JSON5.stringify(instance)}' is not an instance of '${constructor.name}'`,
        );
    }
}

const assertions: {
    instanceOf: typeof instanceOf;
} = {
    instanceOf,
};

export const instanceGuards = {
    assertions,
    checkOverrides: {
        instanceOf:
            autoGuard<
                <InstanceType>(
                    instance: unknown,
                    constructor: Constructor<InstanceType>,
                ) => instance is InstanceType
            >(),
    },
    assertWrapOverrides: {
        instanceOf:
            autoGuard<
                <InstanceType>(
                    instance: unknown,
                    constructor: Constructor<InstanceType>,
                    failureMessage?: string | undefined,
                ) => InstanceType
            >(),
    },
    checkWrapOverrides: {
        instanceOf:
            autoGuard<
                <InstanceType>(
                    instance: unknown,
                    constructor: Constructor<InstanceType>,
                ) => InstanceType | undefined
            >(),
    },
    waitUntilOverrides: {
        instanceOf:
            autoGuard<
                <InstanceType>(
                    constructor: Constructor<InstanceType>,
                    callback: () => unknown,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<InstanceType>
            >(),
    },
} satisfies GuardGroup;
