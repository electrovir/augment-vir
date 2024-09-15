import {type MaybePromise, stringify} from '@augment-vir/core';
import {AssertionError} from '../augments/assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {type WaitUntilOptions} from '../guard-types/wait-until-function.js';

/* eslint-disable @typescript-eslint/no-unused-vars */

function endsWith<const ArrayElement>(
    parent: ReadonlyArray<ArrayElement>,
    child: ArrayElement,
    failureMessage?: string | undefined,
): void;
function endsWith(parent: string, child: string, failureMessage?: string | undefined): void;
function endsWith(
    parent: string | ReadonlyArray<string>,
    child: string,
    failureMessage?: string | undefined,
): void;
function endsWith<const ArrayElement>(
    parent: string | ReadonlyArray<ArrayElement>,
    child: string | ArrayElement,
    failureMessage?: string | undefined,
): void {
    const message = `${stringify(parent)} does not end with ${stringify(child)}}`;
    if (typeof parent === 'string') {
        if (!parent.endsWith(child as string)) {
            throw new AssertionError(message, failureMessage);
        }
    } else if (parent[parent.length - 1] !== child) {
        throw new AssertionError(message, failureMessage);
    }
}

/* node:coverage disable */
function boundaryCheck<const ArrayElement>(
    parent: ReadonlyArray<ArrayElement>,
    child: ArrayElement,
    failureMessage?: string | undefined,
): boolean;
function boundaryCheck(parent: string, child: string, failureMessage?: string | undefined): boolean;
function boundaryCheck(
    parent: string | ReadonlyArray<string>,
    child: string,
    failureMessage?: string | undefined,
): boolean;
function boundaryCheck(): any {
    /**
     * This function isn't actually used at run time, it's only used as a type for function
     * overloads.
     */
}
function boundaryAssertWrap<const ArrayElement>(
    parent: ReadonlyArray<ArrayElement>,
    child: ArrayElement,
    failureMessage?: string | undefined,
): typeof parent;
function boundaryAssertWrap(
    parent: string,
    child: string,
    failureMessage?: string | undefined,
): typeof parent;
function boundaryAssertWrap(
    parent: string | ReadonlyArray<string>,
    child: string,
    failureMessage?: string | undefined,
): typeof parent;
function boundaryAssertWrap(): any {
    /**
     * This function isn't actually used at run time, it's only used as a type for function
     * overloads.
     */
}
function boundaryCheckWrap<const ArrayElement>(
    parent: ReadonlyArray<ArrayElement>,
    child: ArrayElement,
    failureMessage?: string | undefined,
): typeof parent | undefined;
function boundaryCheckWrap(
    parent: string,
    child: string,
    failureMessage?: string | undefined,
): typeof parent | undefined;
function boundaryCheckWrap(
    parent: string | ReadonlyArray<string>,
    child: string,
    failureMessage?: string | undefined,
): typeof parent | undefined;
function boundaryCheckWrap(): any {
    /**
     * This function isn't actually used at run time, it's only used as a type for function
     * overloads.
     */
}
function boundaryWaitUntil<const ArrayElement>(
    child: ArrayElement,
    callback: () => MaybePromise<ReadonlyArray<ArrayElement>>,
    options?: WaitUntilOptions | undefined,
    failureMessage?: string | undefined,
): Promise<ReadonlyArray<ArrayElement>>;
function boundaryWaitUntil(
    child: string,
    callback: () => MaybePromise<string>,
    options?: WaitUntilOptions | undefined,
    failureMessage?: string | undefined,
): Promise<string>;
function boundaryWaitUntil(
    child: string,
    callback: () => MaybePromise<string | ReadonlyArray<string>>,
    options?: WaitUntilOptions | undefined,
    failureMessage?: string | undefined,
): Promise<string | ReadonlyArray<string>>;
function boundaryWaitUntil(): any {
    /**
     * This function isn't actually used at run time, it's only used as a type for function
     * overloads.
     */
}
/* node:coverage enable */

function endsWithout<const ArrayElement>(
    parent: ReadonlyArray<ArrayElement>,
    child: ArrayElement,
    failureMessage?: string | undefined,
): void;
function endsWithout(parent: string, child: string, failureMessage?: string | undefined): void;
function endsWithout(
    parent: string | ReadonlyArray<string>,
    child: string,
    failureMessage?: string | undefined,
): void;
function endsWithout<const ArrayElement>(
    parent: string | ReadonlyArray<ArrayElement>,
    child: string | ArrayElement,
    failureMessage?: string | undefined,
): void {
    const message = `${stringify(parent)} ends with ${stringify(child)}}`;
    if (typeof parent === 'string') {
        if (parent.endsWith(child as string)) {
            throw new AssertionError(message, failureMessage);
        }
    } else if (parent[parent.length - 1] === child) {
        throw new AssertionError(message, failureMessage);
    }
}

function startsWith<const ArrayElement>(
    parent: ReadonlyArray<ArrayElement>,
    child: ArrayElement,
    failureMessage?: string | undefined,
): void;
function startsWith(parent: string, child: string, failureMessage?: string | undefined): void;
function startsWith(
    parent: string | ReadonlyArray<string>,
    child: string,
    failureMessage?: string | undefined,
): void;
function startsWith<const ArrayElement>(
    parent: string | ReadonlyArray<ArrayElement>,
    child: string | ArrayElement,
    failureMessage?: string | undefined,
): void {
    const message = `${stringify(parent)} does not start with ${stringify(child)}}`;
    if (typeof parent === 'string') {
        if (!parent.startsWith(child as string)) {
            throw new AssertionError(message, failureMessage);
        }
    } else if (parent[0] !== child) {
        throw new AssertionError(message, failureMessage);
    }
}

function startsWithout<const ArrayElement>(
    parent: ReadonlyArray<ArrayElement>,
    child: ArrayElement,
    failureMessage?: string | undefined,
): void;
function startsWithout(parent: string, child: string, failureMessage?: string | undefined): void;
function startsWithout(
    parent: string | ReadonlyArray<string>,
    child: string,
    failureMessage?: string | undefined,
): void;
function startsWithout<const ArrayElement>(
    parent: string | ReadonlyArray<string>,
    child: string | ArrayElement,
    failureMessage?: string | undefined,
): void {
    const message = `${stringify(parent)} starts with ${stringify(child)}}`;
    if (typeof parent === 'string') {
        if (parent.startsWith(child as string)) {
            throw new AssertionError(message, failureMessage);
        }
    } else if (parent[0] === child) {
        throw new AssertionError(message, failureMessage);
    }
}

const assertions: {
    /**
     * Asserts that a parent string or array ends with a specific child. This uses reference
     * equality when the parent is an array.
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.endsWith('ab', 'b'); // passes
     * assert.endsWith('ab', 'a'); // fails
     * assert.endsWith(
     *     [
     *         'a',
     *         'b',
     *     ],
     *     'b',
     * ); // passes
     * assert.endsWith(
     *     [
     *         'a',
     *         'b',
     *     ],
     *     'a',
     * ); // fails
     * ```
     *
     * @throws {@link AssertionError} If the parent does not end with the child.
     * @see
     * - {@link assert.endsWithout} : the opposite assertion.
     * - {@link assert.startsWith} : assertion on the other end.
     */
    endsWith: typeof endsWith;
    /**
     * Asserts that a parent string or array does _not_ end with a specific child. This uses
     * reference equality when the parent is an array.
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.endsWithout('ab', 'b'); // fails
     * assert.endsWithout('ab', 'a'); // passes
     * assert.endsWithout(
     *     [
     *         'a',
     *         'b',
     *     ],
     *     'b',
     * ); // fails
     * assert.endsWithout(
     *     [
     *         'a',
     *         'b',
     *     ],
     *     'a',
     * ); // passes
     * ```
     *
     * @throws {@link AssertionError} If the parent ends with the child.
     * @see
     * - {@link assert.endsWith} : the opposite assertion.
     * - {@link assert.startsWithout} : assertion on the other end.
     */
    endsWithout: typeof endsWithout;
    /**
     * Asserts that a parent string or array starts with a specific child. This uses reference
     * equality when the parent is an array.
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.startsWith('ab', 'b'); // fails
     * assert.startsWith('ab', 'a'); // passes
     * assert.startsWith(
     *     [
     *         'a',
     *         'b',
     *     ],
     *     'b',
     * ); // fails
     * assert.startsWith(
     *     [
     *         'a',
     *         'b',
     *     ],
     *     'a',
     * ); // passes
     * ```
     *
     * @throws {@link AssertionError} If the parent does not start with the child.
     * @see
     * - {@link assert.startsWithout} : the opposite assertion.
     * - {@link assert.endsWith} : assertion on the other end.
     */
    startsWith: typeof startsWith;
    /**
     * Asserts that a parent string or array starts with a specific child. This uses reference
     * equality when the parent is an array.
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.startsWith('ab', 'b'); // passes
     * assert.startsWith('ab', 'a'); // fails
     * assert.startsWith(
     *     [
     *         'a',
     *         'b',
     *     ],
     *     'b',
     * ); // passes
     * assert.startsWith(
     *     [
     *         'a',
     *         'b',
     *     ],
     *     'a',
     * ); // fails
     * ```
     *
     * @throws {@link AssertionError} If the parent does start with the child.
     * @see
     * - {@link assert.startsWithout} : the opposite assertion.
     * - {@link assert.endsWith} : assertion on the other end.
     */
    startsWithout: typeof startsWithout;
} = {
    endsWith,
    endsWithout,
    startsWith,
    startsWithout,
};

export const boundaryGuards = {
    assert: assertions,
    check: {
        /**
         * Checks that a parent string or array ends with a specific child. This uses reference
         * equality when the parent is an array.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.endsWith('ab', 'b'); // returns `true`
         * check.endsWith('ab', 'a'); // returns `false`
         * check.endsWith(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'b',
         * ); // returns `true`
         * check.endsWith(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'a',
         * ); // returns `false`
         * ```
         *
         * @see
         * - {@link check.endsWithout} : the opposite check.
         * - {@link check.startsWith} : check on the other end.
         */
        endsWith: autoGuard<typeof boundaryCheck>(),
        /**
         * Checks that a parent string or array does _not_ end with a specific child. This uses
         * reference equality when the parent is an array.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.endsWithout('ab', 'b'); // returns `false`
         * check.endsWithout('ab', 'a'); // returns `true`
         * check.endsWithout(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'b',
         * ); // returns `false`
         * check.endsWithout(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'a',
         * ); // returns `true`
         * ```
         *
         * @see
         * - {@link check.endsWith} : the opposite check.
         * - {@link check.startsWithout} : check on the other end.
         */
        endsWithout: autoGuard<typeof boundaryCheck>(),

        /**
         * Checks that a parent string or array starts with a specific child. This uses reference
         * equality when the parent is an array.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.startsWith('ab', 'b'); // returns `false`
         * check.startsWith('ab', 'a'); // returns `true`
         * check.startsWith(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'b',
         * ); // returns `false`
         * check.startsWith(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'a',
         * ); // returns `true`
         * ```
         *
         * @see
         * - {@link check.startsWithout} : the opposite check.
         * - {@link check.endsWith} : check on the other end.
         */
        startsWith: autoGuard<typeof boundaryCheck>(),
        /**
         * Checks that a parent string or array starts with a specific child. This uses reference
         * equality when the parent is an array.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.startsWith('ab', 'b'); // returns `false`
         * check.startsWith('ab', 'a'); // returns `true`
         * check.startsWith(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'b',
         * ); // returns `false`
         * check.startsWith(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'a',
         * ); // returns `true`
         * ```
         *
         * @see
         * - {@link check.startsWithout} : the opposite check.
         * - {@link check.endsWith} : check on the other end.
         */
        startsWithout: autoGuard<typeof boundaryCheck>(),
    },
    assertWrap: {
        /**
         * Asserts that a parent string or array ends with a specific child. This uses reference
         * equality when the parent is an array. Returns the parent if the assertion passes.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.endsWith('ab', 'b'); // returns `'ab'`
         * assertWrap.endsWith('ab', 'a'); // throws an error
         * assertWrap.endsWith(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'b',
         * ); // returns `['a', 'b']`
         * assertWrap.endsWith(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'a',
         * ); // throws an error
         * ```
         *
         * @returns The parent value if it does end with the child.
         * @throws {@link AssertionError} If the parent does not end with the child.
         * @see
         * - {@link assertWrap.endsWithout} : the opposite assertion.
         * - {@link assertWrap.startsWith} : assertion on the other end.
         */
        endsWith: autoGuard<typeof boundaryAssertWrap>(),
        /**
         * Asserts that a parent string or array does _not_ end with a specific child. This uses
         * reference equality when the parent is an array. Returns the parent if the assertion
         * passes.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.endsWithout('ab', 'b'); // throws an error
         * assertWrap.endsWithout('ab', 'a'); // returns `'ab'`
         * assertWrap.endsWithout(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'b',
         * ); // throws an error
         * assertWrap.endsWithout(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'a',
         * ); // returns `['a', 'b']`
         * ```
         *
         * @returns The parent value if it does not end with the child.
         * @throws {@link AssertionError} If the parent ends with the child.
         * @see
         * - {@link assertWrap.endsWith} : the opposite assertion.
         * - {@link assertWrap.startsWithout} : assertion on the other end.
         */
        endsWithout: autoGuard<typeof boundaryAssertWrap>(),
        /**
         * Checks that a parent string or array starts with a specific child. This uses reference
         * equality when the parent is an array. Returns the parent if the assertion passes.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.startsWith('ab', 'b'); // throws an error
         * assertWrap.startsWith('ab', 'a'); // returns `'ab'`
         * assertWrap.startsWith(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'b',
         * ); // throws an error
         * assertWrap.startsWith(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'a',
         * ); // returns `['a', 'b']`
         * ```
         *
         * @returns The parent value if it starts with the child.
         * @throws {@link AssertionError} If the parent does not start with the child.
         * @see
         * - {@link assertWrap.startsWithout} : the opposite assertion.
         * - {@link assertWrap.endsWith} : assertion on the other end.
         */
        startsWith: autoGuard<typeof boundaryAssertWrap>(),
        /**
         * Asserts that a parent string or array starts with a specific child. This uses reference
         * equality when the parent is an array. Returns the parent if the assertion passes.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.startsWith('ab', 'b'); // returns `'ab'`
         * assertWrap.startsWith('ab', 'a'); // throws an error
         * assertWrap.startsWith(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'b',
         * ); // returns `['a', 'b']`
         * assertWrap.startsWith(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'a',
         * ); // throws an error
         * ```
         *
         * @returns The parent value if it does not start with the child.
         * @throws {@link AssertionError} If the parent does start with the child.
         * @see
         * - {@link assertWrap.startsWithout} : the opposite assertion.
         * - {@link assertWrap.endsWith} : assertion on the other end.
         */
        startsWithout: autoGuard<typeof boundaryAssertWrap>(),
    },
    checkWrap: {
        /**
         * Checks that a parent string or array ends with a specific child. This uses reference
         * equality when the parent is an array. Returns the value if the check passes, otherwise
         * `undefined`.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.endsWith('ab', 'b'); // returns `'ab'`
         * checkWrap.endsWith('ab', 'a'); // returns `undefined`
         * checkWrap.endsWith(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'b',
         * ); // returns `['a', 'b']`
         * checkWrap.endsWith(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'a',
         * ); // returns `undefined`
         * ```
         *
         * @returns The first value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.endsWithout} : the opposite check.
         * - {@link checkWrap.startsWith} : check on the other end.
         */
        endsWith: autoGuard<typeof boundaryCheckWrap>(),
        /**
         * Checks that a parent string or array does _not_ end with a specific child. This uses
         * reference equality when the parent is an array. Returns the value if the check passes,
         * otherwise `undefined`.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.endsWithout('ab', 'b'); // returns `undefined`
         * checkWrap.endsWithout('ab', 'a'); // returns `'ab'`
         * checkWrap.endsWithout(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'b',
         * ); // returns `undefined`
         * checkWrap.endsWithout(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'a',
         * ); // returns `['a', 'b']`
         * ```
         *
         * @returns The first value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.endsWith} : the opposite check.
         * - {@link checkWrap.startsWithout} : check on the other end.
         */
        endsWithout: autoGuard<typeof boundaryCheckWrap>(),
        /**
         * Checks that a parent string or array starts with a specific child. This uses reference
         * equality when the parent is an array. Returns the value if the check passes, otherwise
         * `undefined`.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.startsWith('ab', 'b'); // returns `undefined`
         * checkWrap.startsWith('ab', 'a'); // returns `'ab'`
         * checkWrap.startsWith(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'b',
         * ); // returns `undefined`
         * checkWrap.startsWith(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'a',
         * ); // returns `['a', 'b']`
         * ```
         *
         * @returns The first value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.startsWithout} : the opposite check.
         * - {@link checkWrap.endsWith} : check on the other end.
         */
        startsWith: autoGuard<typeof boundaryCheckWrap>(),
        /**
         * Checks that a parent string or array starts with a specific child. This uses reference
         * equality when the parent is an array. Returns the value if the check passes, otherwise
         * `undefined`.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.startsWith('ab', 'b'); // returns `undefined`
         * checkWrap.startsWith('ab', 'a'); // returns `'ab'`
         * checkWrap.startsWith(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'b',
         * ); // returns `undefined`
         * checkWrap.startsWith(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     'a',
         * ); // returns `['a', 'b']`
         * ```
         *
         * @returns The first value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.startsWithout} : the opposite check.
         * - {@link checkWrap.endsWith} : check on the other end.
         */
        startsWithout: autoGuard<typeof boundaryCheckWrap>(),
    },
    waitUntil: {
        /**
         * Repeatedly calls a callback until its output string or array ends with the first input
         * child value. This uses reference equality when the parent is an array. Once the callback
         * output passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.endsWith('b', () => 'ab'); // returns `'ab'`
         * await waitUntil.endsWith('a', () => 'ab'); // throws an error
         * await waitUntil.endsWith('b', () => [
         *     'a',
         *     'b',
         * ]); // returns `['a', 'b']`
         * await waitUntil.endsWith('a', () => [
         *     'a',
         *     'b',
         * ]); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.endsWithout} : the opposite assertion.
         * - {@link waitUntil.startsWith} : assertion on the other end.
         */
        endsWith: autoGuard<typeof boundaryWaitUntil>(),
        /**
         * Repeatedly calls a callback until its output string or array does not end with the first
         * input child value. This uses reference equality when the parent is an array. Once the
         * callback output passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.endsWith('b', () => 'ab'); // throws an error
         * await waitUntil.endsWith('a', () => 'ab'); // returns `'ab'`
         * await waitUntil.endsWith('b', () => [
         *     'a',
         *     'b',
         * ]); // throws an error
         * await waitUntil.endsWith('a', () => [
         *     'a',
         *     'b',
         * ]); // returns `['a', 'b']`
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.endsWith} : the opposite assertion.
         * - {@link waitUntil.startsWithout} : assertion on the other end.
         */
        endsWithout: autoGuard<typeof boundaryWaitUntil>(),
        /**
         * Repeatedly calls a callback until its output string or array starts with the first input
         * child value. This uses reference equality when the parent is an array. Once the callback
         * output passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.endsWith('b', () => 'ab'); // throws an error
         * await waitUntil.endsWith('a', () => 'ab'); // returns `'ab'`
         * await waitUntil.endsWith('b', () => [
         *     'a',
         *     'b',
         * ]); // throws an error
         * await waitUntil.endsWith('a', () => [
         *     'a',
         *     'b',
         * ]); // returns `['a', 'b']`
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.startsWithout} : the opposite assertion.
         * - {@link waitUntil.endsWith} : assertion on the other end.
         */
        startsWith: autoGuard<typeof boundaryWaitUntil>(),
        /**
         * Repeatedly calls a callback until its output string or array does not start with the
         * first input child value. This uses reference equality when the parent is an array. Once
         * the callback output passes, it is returned. If the attempts time out, an error is
         * thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * await waitUntil.endsWith('b', () => 'ab'); // returns `'ab'`
         * await waitUntil.endsWith('a', () => 'ab'); // throws an error
         * await waitUntil.endsWith('b', () => [
         *     'a',
         *     'b',
         * ]); // returns `['a', 'b']`
         * await waitUntil.endsWith('a', () => [
         *     'a',
         *     'b',
         * ]); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.startsWith} : the opposite assertion.
         * - {@link waitUntil.endsWithout} : assertion on the other end.
         */
        startsWithout: autoGuard<typeof boundaryWaitUntil>(),
    },
} satisfies GuardGroup<typeof assertions>;
