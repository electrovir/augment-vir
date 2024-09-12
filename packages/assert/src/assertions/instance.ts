import {MaybePromise, stringify} from '@augment-vir/core';
import {Constructor} from 'type-fest';
import {AssertionError} from '../augments/assertion.error.js';
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
            `'${stringify(instance)}' is not an instance of '${constructor.name}'`,
            failureMessage,
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
            `'${stringify(instance)}' is an instance of '${constructor.name}'`,
            failureMessage,
        );
    }
}

const assertions: {
    /**
     * Asserts that a value is an instance of the given class constructor.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.instanceOf(/abc/, RegExp); // passes
     * assert.instanceOf('abc', RegExp); // fails
     * ```
     *
     * @throws {@link AssertionError} If the value is not an instance of the given class
     *   constructor.
     * @see
     * - {@link assert.notInstanceOf} : the opposite assertion.
     */
    instanceOf: typeof instanceOf;
    /**
     * Asserts that a value is _not_ an instance of the given class constructor.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.notInstanceOf(/abc/, RegExp); // fails
     * assert.notInstanceOf('abc', RegExp); // passes
     * ```
     *
     * @throws {@link AssertionError} If the value is an instance of the given class constructor.
     * @see
     * - {@link assert.instanceOf} : the opposite assertion.
     */
    notInstanceOf: typeof notInstanceOf;
} = {
    instanceOf,
    notInstanceOf,
};

export const instanceGuards = {
    assert: assertions,
    check: {
        /**
         * Checks that a value is an instance of the given class constructor.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.instanceOf(/abc/, RegExp); // returns `true`
         * check.instanceOf('abc', RegExp); // returns `false`
         * ```
         *
         * @see
         * - {@link check.notInstanceOf} : the opposite check.
         */
        instanceOf:
            autoGuard<
                <const Instance>(
                    instance: unknown,
                    constructor: Constructor<Instance>,
                ) => instance is Instance
            >(),
        /**
         * Checks that a value is _not_ an instance of the given class constructor.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.notInstanceOf(/abc/, RegExp); // returns `false`
         * check.notInstanceOf('abc', RegExp); // returns `true`
         * ```
         *
         * @see
         * - {@link check.instanceOf} : the opposite check.
         */
        notInstanceOf:
            autoGuard<
                <const Actual, const Instance>(
                    instance: Actual,
                    constructor: Constructor<Instance>,
                ) => instance is Exclude<Actual, Instance>
            >(),
    },
    assertWrap: {
        /**
         * Asserts that a value is an instance of the given class constructor. Returns the value if
         * the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.instanceOf(/abc/, RegExp); // returns `/abc/`
         * assertWrap.instanceOf('abc', RegExp); // throws an error
         * ```
         *
         * @throws {@link AssertionError} If the value is not an instance of the given class
         *   constructor.
         * @see
         * - {@link assertWrap.notInstanceOf} : the opposite assertion.
         */
        instanceOf:
            autoGuard<
                <const Instance>(
                    instance: unknown,
                    constructor: Constructor<Instance>,
                    failureMessage?: string | undefined,
                ) => Instance
            >(),
        /**
         * Asserts that a value is _not_ an instance of the given class constructor. Returns the
         * value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.notInstanceOf(/abc/, RegExp); // throws an error
         * assertWrap.notInstanceOf('abc', RegExp); // returns `'abc'`
         * ```
         *
         * @throws {@link AssertionError} If the value is an instance of the given class
         *   constructor.
         * @see
         * - {@link assertWrap.instanceOf} : the opposite assertion.
         */
        notInstanceOf:
            autoGuard<
                <const Actual, const Instance>(
                    instance: Actual,
                    constructor: Constructor<Instance>,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, Instance>
            >(),
    },
    checkWrap: {
        /**
         * Checks that a value is an instance of the given class constructor. Returns the value if
         * the check passes, otherwise `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.instanceOf(/abc/, RegExp); // returns `/abc/`
         * checkWrap.instanceOf('abc', RegExp); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.notInstanceOf} : the opposite check.
         */
        instanceOf:
            autoGuard<
                <const Instance>(
                    instance: unknown,
                    constructor: Constructor<Instance>,
                ) => Instance | undefined
            >(),
        /**
         * Checks that a value is _not_ an instance of the given class constructor. Returns the
         * value if the check passes, otherwise `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.notInstanceOf(/abc/, RegExp); // returns `undefined`
         * checkWrap.notInstanceOf('abc', RegExp); // returns `'abc'`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.instanceOf} : the opposite check.
         */
        notInstanceOf:
            autoGuard<
                <const Actual, const Instance>(
                    instance: Actual,
                    constructor: Constructor<Instance>,
                ) => Exclude<Actual, Instance> | undefined
            >(),
    },
    waitUntil: {
        /**
         * Repeatedly calls a callback until its output is an instance of the given class
         * constructor. Once the callback output passes, it is returned. If the attempts time out,
         * an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.instanceOf(RegExp, () => /abc/); // returns `/abc/`
         * await waitUntil.instanceOf(RegExp, () => 'abc'); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.notInstanceOf} : the opposite assertion.
         */
        instanceOf:
            autoGuard<
                <const Instance>(
                    constructor: Constructor<Instance>,
                    callback: () => MaybePromise<unknown>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Instance>
            >(),
        /**
         * Repeatedly calls a callback until its output is not an instance of the given class
         * constructor. Once the callback output passes, it is returned. If the attempts time out,
         * an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.instanceOf(RegExp, () => /abc/); // throws an error
         * await waitUntil.instanceOf(RegExp, () => 'abc'); // returns `'abc'`
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.instanceOf} : the opposite assertion.
         */
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
} satisfies GuardGroup<typeof assertions>;
