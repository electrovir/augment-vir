import {
    type AnyObject,
    type MaybePromise,
    type NarrowToActual,
    type NarrowToExpected,
    stringify,
    type Values,
} from '@augment-vir/core';
import {type EmptyObject} from 'type-fest';
import {AssertionError} from '../augments/assertion.error.js';
import {type GuardGroup} from '../guard-types/guard-group.js';
import {createWaitUntil, type WaitUntilOptions} from '../guard-types/wait-until-function.js';

function hasValue(this: void, parent: object | string, value: unknown): boolean {
    if (typeof parent === 'string') {
        return typeof value === 'string' && parent.includes(value);
    }
    /** Wrap this in a try/catch because `Reflect.ownKeys` can fail depending on what its input is. */
    let hasValue: boolean = true;

    try {
        hasValue = Reflect.ownKeys(parent)
            .map((key) => parent[key as keyof typeof parent] as unknown)
            .includes(value);
    } catch {
        return false;
    }

    return hasValue;
}

export function isIn<Parent extends object | string>(
    this: void,
    child: unknown,
    parent: Parent,
): child is Values<Parent> {
    if (typeof parent === 'string') {
        return parent.includes(child as string);
    } else {
        return hasValue(parent, child);
    }
}

/**
 * All types that can be checked for emptiness. The empty variants of these types are represented in
 * {@link Empty}.
 *
 * @category Assert : Util
 * @category Package : @augment-vir/assert
 * @package [`@augment-vir/assert`](https://www.npmjs.com/package/@augment-vir/assert)
 */
export type CanBeEmpty = string | Map<any, any> | Set<any> | AnyObject | any[];
/**
 * Empty versions of {@link CanBeEmpty}. Note that there is no way to distinguish an empty `Set` or
 * `Map` from their non-empty counterparts in TypeScript (so you will get no emptiness type safety
 * for them.)
 *
 * @category Assert : Util
 * @category Package : @augment-vir/assert
 * @package [`@augment-vir/assert`](https://www.npmjs.com/package/@augment-vir/assert)
 */
export type Empty = '' | EmptyObject | [] | Map<any, any> | Set<any>;

const assertions = {
    /**
     * Asserts that an object/array parent includes a child value through reference equality.
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * const child = {a: 'a'};
     *
     * assert.hasValue({child}, child); // passes
     * assert.hasValue({child: {a: 'a'}}, child); // fails
     * assert.hasValue([child], child); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.lacksValue} : the opposite assertion.
     * - {@link assert.hasValues} : the multi-value assertion.
     */
    hasValue(
        this: void,
        parent: object | string,
        value: unknown,
        failureMessage?: string | undefined,
    ) {
        if (!hasValue(parent, value)) {
            throw new AssertionError(
                `'${stringify(parent)}' does not have value '${stringify(value)}'.`,
                failureMessage,
            );
        }
    },
    /**
     * Asserts that an object/array parent does _not_ include a child value through reference
     * equality.
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * const child = {a: 'a'};
     *
     * assert.lacksValue({child}, child); // fails
     * assert.lacksValue({child: {a: 'a'}}, child); // passes
     * assert.lacksValue([child], child); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.hasValue} : the opposite assertion.
     * - {@link assert.lacksValues} : the multi-value assertion.
     */
    lacksValue(
        this: void,
        parent: object | string,
        value: unknown,
        failureMessage?: string | undefined,
    ) {
        if (hasValue(parent, value)) {
            throw new AssertionError(
                `'${stringify(parent)}' has value '${stringify(value)}'.`,
                failureMessage,
            );
        }
    },

    /**
     * Asserts that an object/array parent includes all child values through reference equality.
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * const child = {a: 'a'};
     * const child2 = {b: 'b'};
     *
     * assert.hasValues({child, child2}, [
     *     child,
     *     child2,
     * ]); // passes
     * assert.hasValues({child: {a: 'a'}, child2}, [
     *     child,
     *     child2,
     * ]); // fails
     * assert.hasValues(
     *     [child],
     *     [
     *         child,
     *         child2,
     *     ],
     * ); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.lacksValues} : the opposite assertion.
     * - {@link assert.hasValue} : the single-value assertion.
     */
    hasValues(
        this: void,
        parent: object | string,
        values: unknown[],
        failureMessage?: string | undefined,
    ) {
        let missingValues: unknown[] = [];

        if (typeof parent === 'string') {
            missingValues = values.filter((value) => {
                return !(typeof value === 'string' && parent.includes(value));
            });
        } else {
            try {
                const actualValues = Reflect.ownKeys(parent).map(
                    (key) => parent[key as keyof typeof parent] as unknown,
                );

                missingValues = values.filter((value) => {
                    return !actualValues.includes(value);
                });
            } catch {
                throw new AssertionError(
                    `'${stringify(parent)}' does not have values '${stringify(values)}'.`,
                    failureMessage,
                );
            }
        }

        if (missingValues.length) {
            throw new AssertionError(
                `'${stringify(parent)}' does not have values '${stringify(missingValues)}'.`,
                failureMessage,
            );
        }
    },

    /**
     * Asserts that an object/array parent includes none of the provided child values through
     * reference equality.
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * const child = {a: 'a'};
     * const child2 = {b: 'b'};
     *
     * assert.lacksValues({}, [
     *     child,
     *     child2,
     * ]); // passes
     * assert.lacksValues({child, child2}, [
     *     child,
     *     child2,
     * ]); // fails
     * assert.lacksValues({child: {a: 'a'}, child2}, [
     *     child,
     *     child2,
     * ]); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.lacksValues} : the opposite assertion.
     * - {@link assert.hasValue} : the single-value assertion.
     */
    lacksValues(
        this: void,
        parent: object | string,
        values: unknown[],
        failureMessage?: string | undefined,
    ) {
        let includedValues: unknown[] = [];

        if (typeof parent === 'string') {
            includedValues = values.filter((value) => {
                return typeof value === 'string' && parent.includes(value);
            });
        } else {
            try {
                const actualValues = Reflect.ownKeys(parent).map(
                    (key) => parent[key as keyof typeof parent] as unknown,
                );

                includedValues = values.filter((value) => {
                    return actualValues.includes(value);
                });
            } catch {
                // ignore error
            }
        }

        if (includedValues.length) {
            throw new AssertionError(
                `'${stringify(parent)}' has values '${stringify(includedValues)}'.`,
                failureMessage,
            );
        }
    },
    /**
     * Asserts that child value is contained within a parent object, array, or string through
     * reference equality.
     *
     * Type guards the child when possible.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * const child = {a: 'a'};
     *
     * assert.isIn(child, {child}); // passes
     * assert.isIn('a', 'ab'); // passes
     * assert.isIn(child, [child]); // passes
     *
     * assert.isIn(child, {child: {a: 'a'}}); // fails
     * assert.isIn('a', 'bc'); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.isNotIn} : the opposite assertion.
     */
    isIn<Parent extends object | string>(
        this: void,
        child: unknown,
        parent: Parent,
        failureMessage?: string | undefined,
    ): asserts child is Values<Parent> {
        if (!isIn(child, parent)) {
            throw new AssertionError(
                `'${stringify(child)}'\n\nis not in\n\n${stringify(parent)}.`,
                failureMessage,
            );
        }
    },
    /**
     * Asserts that child value is _not_ contained within a parent object, array, or string through
     * reference equality.
     *
     * Type guards the child when possible.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * const child = {a: 'a'};
     *
     * assert.isNotIn(child, {child}); // fails
     * assert.isNotIn('a', 'ab'); // fails
     * assert.isNotIn(child, [child]); // fails
     *
     * assert.isNotIn(child, {child: {a: 'a'}}); // passes
     * assert.isNotIn('a', 'bc'); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.isIn} : the opposite assertion.
     */
    isNotIn<Parent extends object | string, Child>(
        this: void,
        child: Child,
        parent: Parent,
        failureMessage?: string | undefined,
    ): asserts child is Exclude<Child, Values<Parent>> {
        if (isIn(child, parent)) {
            throw new AssertionError(
                `'${stringify(child)}'\n\nis in\n\n${stringify(parent)}.`,
                failureMessage,
            );
        }
    },
    /**
     * Asserts that a value is empty. Supports strings, Maps, Sets, objects, and arrays.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isEmpty({}); // passes
     * assert.isEmpty(''); // passes
     * assert.isEmpty([]); // passes
     *
     * assert.isEmpty('a'); // fails
     * assert.isEmpty({a: 'a'}); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.isNotEmpty} : the opposite assertion.
     */
    isEmpty<Actual extends CanBeEmpty>(
        this: void,
        actual: Actual,
        failureMessage?: string | undefined,
    ): asserts actual is NarrowToActual<Actual, Empty> {
        if (typeof actual !== 'string' && typeof actual !== 'object') {
            throw new AssertionError(`'${stringify(actual)}' is not empty.`, failureMessage);
        }

        if (typeof actual === 'string' && !actual) {
            // eslint-disable-next-line sonarjs/no-gratuitous-expressions
            if (!actual) {
                return;
            }
        } else if (Array.isArray(actual)) {
            if (!actual.length) {
                return;
            }
        } else if (actual instanceof Map || actual instanceof Set) {
            if (!actual.size) {
                return;
            }
        } else if (typeof actual === 'object' && !Object.keys(actual).length) {
            return;
        }

        throw new AssertionError(`'${stringify(actual)}' is not empty.`, failureMessage);
    },
    /**
     * Asserts that a value is _not_ empty. Supports strings, Maps, Sets, objects, and arrays.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isNotEmpty({}); // fails
     * assert.isNotEmpty(''); // fails
     * assert.isNotEmpty([]); // fails
     *
     * assert.isNotEmpty('a'); // passes
     * assert.isNotEmpty({a: 'a'}); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.isEmpty} : the opposite assertion.
     */
    isNotEmpty<Actual extends CanBeEmpty>(
        this: void,
        actual: Actual,
        failureMessage?: string | undefined,
    ): asserts actual is Exclude<Actual, Empty> {
        if (typeof actual !== 'string' && typeof actual !== 'object') {
            return;
        }

        if (typeof actual === 'string' && !actual) {
            // eslint-disable-next-line sonarjs/no-gratuitous-expressions
            if (!actual) {
                throw new AssertionError(`'${stringify(actual)}' is not empty.`, failureMessage);
            }
        } else if (Array.isArray(actual)) {
            if (!actual.length) {
                throw new AssertionError(`'${stringify(actual)}' is not empty.`, failureMessage);
            }
        } else if (actual instanceof Map || actual instanceof Set) {
            if (!actual.size) {
                throw new AssertionError(`'${stringify(actual)}' is not empty.`, failureMessage);
            }
        } else if (typeof actual === 'object' && !Object.keys(actual).length) {
            throw new AssertionError(`'${stringify(actual)}' is not empty.`, failureMessage);
        }
    },
};

export const valueGuards = {
    assert: assertions,
    check: {
        /**
         * Checks that an object/array parent includes a child value through reference equality.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         *
         * check.hasValue({child}, child); // returns `true`
         * check.hasValue({child: {a: 'a'}}, child); // returns `false`
         * check.hasValue([child], child); // returns `true`
         * ```
         *
         * @see
         * - {@link check.lacksValue} : the opposite check.
         * - {@link check.hasValues} : the multi-value check.
         */
        hasValue(this: void, parent: object | string, value: unknown): boolean {
            return hasValue(parent, value);
        },
        /**
         * Checks that an object/array parent does _not_ include a child value through reference
         * equality.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         *
         * check.lacksValue({child}, child); // returns `false`
         * check.lacksValue({child: {a: 'a'}}, child); // returns `true`
         * check.lacksValue([child], child); // returns `false`
         * ```
         *
         * @see
         * - {@link check.hasValue} : the opposite check.
         * - {@link check.lacksValues} : the multi-value check.
         */
        lacksValue(this: void, parent: object | string, value: unknown): boolean {
            return !hasValue(parent, value);
        },
        /**
         * Checks that an object/array parent includes all child values through reference equality.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         * const child2 = {b: 'b'};
         *
         * check.hasValues({child, child2}, [
         *     child,
         *     child2,
         * ]); // returns `true`
         * check.hasValues({child: {a: 'a'}, child2}, [
         *     child,
         *     child2,
         * ]); // returns `false`
         * check.hasValues(
         *     [child],
         *     [
         *         child,
         *         child2,
         *     ],
         * ); // returns `true`
         * ```
         *
         * @see
         * - {@link check.lacksValues} : the opposite check.
         * - {@link check.hasValue} : the single-value check.
         */
        hasValues(this: void, parent: object | string, values: unknown[]): boolean {
            return values.every((value) => hasValue(parent, value));
        },
        /**
         * Checks that an object/array parent includes none of the provided child values through
         * reference equality.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         * const child2 = {b: 'b'};
         *
         * check.lacksValues({}, [
         *     child,
         *     child2,
         * ]); // returns `true`
         * check.lacksValues({child, child2}, [
         *     child,
         *     child2,
         * ]); // returns `false`
         * check.lacksValues({child: {a: 'a'}, child2}, [
         *     child,
         *     child2,
         * ]); // returns `false`
         * ```
         *
         * @see
         * - {@link check.lacksValues} : the opposite check.
         * - {@link check.hasValue} : the single-value check.
         */
        lacksValues(this: void, parent: object | string, values: unknown[]): boolean {
            return values.every((value) => !hasValue(parent, value));
        },
        /**
         * Checks that child value is contained within a parent object, array, or string through
         * reference equality.
         *
         * Type guards the child when possible.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         *
         * check.isIn(child, {child}); // returns `true`
         * check.isIn('a', 'ab'); // returns `true`
         * check.isIn(child, [child]); // returns `true`
         *
         * check.isIn(child, {child: {a: 'a'}}); // returns `false`
         * check.isIn('a', 'bc'); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isNotIn} : the opposite check.
         */
        isIn<Parent extends object | string>(
            this: void,
            child: unknown,
            parent: Parent,
        ): child is Values<Parent> {
            return isIn(child, parent);
        },
        /**
         * Checks that child value is _not_ contained within a parent object, array, or string
         * through reference equality.
         *
         * Type guards the child when possible.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         *
         * check.isNotIn(child, {child}); // returns `false`
         * check.isNotIn('a', 'ab'); // returns `false`
         * check.isNotIn(child, [child]); // returns `false`
         *
         * check.isNotIn(child, {child: {a: 'a'}}); // returns `true`
         * check.isNotIn('a', 'bc'); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isIn} : the opposite check.
         */
        isNotIn<Parent extends object | string, Child>(
            this: void,
            child: Child,
            parent: Parent,
        ): child is Exclude<Child, Values<Parent>> {
            return !isIn(child, parent);
        },
        /**
         * Checks that a value is empty. Supports strings, Maps, Sets, objects, and arrays.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isEmpty({}); // returns `true`
         * check.isEmpty(''); // returns `true`
         * check.isEmpty([]); // returns `true`
         *
         * check.isEmpty('a'); // returns `false`
         * check.isEmpty({a: 'a'}); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isNotEmpty} : the opposite check.
         */
        isEmpty<Actual extends CanBeEmpty>(
            this: void,
            actual: Actual,
        ): actual is NarrowToActual<Actual, Empty> {
            if (typeof actual !== 'string' && typeof actual !== 'object') {
                return false;
            }

            if (typeof actual === 'string') {
                return !actual;
            } else if (Array.isArray(actual)) {
                return !actual.length;
            } else if (actual instanceof Map) {
                return !actual.size;
            } else if (actual instanceof Set) {
                return !actual.size;
            } else {
                return !Object.keys(actual).length;
            }
        },
        /**
         * Checks that a value is _not_ empty. Supports strings, Maps, Sets, objects, and arrays.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isNotEmpty({}); // returns `false`
         * check.isNotEmpty(''); // returns `false`
         * check.isNotEmpty([]); // returns `false`
         *
         * check.isNotEmpty('a'); // returns `true`
         * check.isNotEmpty({a: 'a'}); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isEmpty} : the opposite check.
         */
        isNotEmpty<Actual extends CanBeEmpty>(
            this: void,
            actual: Actual,
        ): actual is Exclude<Actual, Empty> {
            if (typeof actual !== 'string' && typeof actual !== 'object') {
                return true;
            }

            if (typeof actual === 'string') {
                return !!actual;
            } else if (Array.isArray(actual)) {
                return !!actual.length;
            } else if (actual instanceof Map) {
                return !!actual.size;
            } else if (actual instanceof Set) {
                return !!actual.size;
            } else {
                return !!Object.keys(actual).length;
            }
        },
    },
    assertWrap: {
        /**
         * Asserts that an object/array parent includes a child value through reference equality.
         * Returns the parent value if the assertion passes.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         *
         * assertWrap.hasValue({child}, child); // returns `{child}`;
         * assertWrap.hasValue({child: {a: 'a'}}, child); // throws an error
         * assertWrap.hasValue([child], child); // returns `[child]`;
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.lacksValue} : the opposite assertion.
         * - {@link assertWrap.hasValues} : the multi-value assertion.
         */
        hasValue<Parent extends object | string>(
            this: void,
            parent: Parent,
            value: unknown,
            failureMessage?: string | undefined,
        ): Parent {
            if (!hasValue(parent, value)) {
                throw new AssertionError(
                    `'${stringify(parent)}' does not have value '${stringify(value)}'.`,
                    failureMessage,
                );
            }

            return parent;
        },
        /**
         * Asserts that an object/array parent does _not_ include a child value through reference
         * equality. Returns the parent value if the assertion passes.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         *
         * assertWrap.lacksValue({child}, child); // throws an error
         * assertWrap.lacksValue({child: {a: 'a'}}, child); // returns `{child: {a: 'a'}}`;
         * assertWrap.lacksValue([child], child); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.hasValue} : the opposite assertion.
         * - {@link assertWrap.lacksValues} : the multi-value assertion.
         */
        lacksValue<Parent extends object | string>(
            this: void,
            parent: Parent,
            value: unknown,
            failureMessage?: string | undefined,
        ): Parent {
            if (hasValue(parent, value)) {
                throw new AssertionError(
                    `'${stringify(parent)}' has value '${stringify(value)}'.`,
                    failureMessage,
                );
            }

            return parent;
        },
        /**
         * Asserts that an object/array parent includes all child values through reference equality.
         * Returns the parent value if the assertion passes.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         * const child2 = {b: 'b'};
         *
         * assertWrap.hasValues({child, child2}, [
         *     child,
         *     child2,
         * ]); // returns `{child, child2}`;
         * assertWrap.hasValues({child: {a: 'a'}, child2}, [
         *     child,
         *     child2,
         * ]); // throws an error
         * assertWrap.hasValues(
         *     [child],
         *     [
         *         child,
         *         child2,
         *     ],
         * ); // returns `[child]`;
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.lacksValues} : the opposite assertion.
         * - {@link assertWrap.hasValue} : the single-value assertion.
         */
        hasValues<Parent extends object | string>(
            this: void,
            parent: Parent,
            values: unknown[],
            failureMessage?: string | undefined,
        ): Parent {
            let missingValues = [];

            if (typeof parent === 'string') {
                missingValues = values.filter((value) => {
                    return !(typeof value === 'string' && parent.includes(value));
                });
            } else {
                try {
                    const actualValues = Reflect.ownKeys(parent).map(
                        (key) => parent[key as keyof typeof parent] as unknown,
                    );

                    missingValues = values.filter((value) => {
                        return !actualValues.includes(value);
                    });
                } catch {
                    throw new AssertionError(
                        `'${stringify(parent)}' does not have values '${stringify(values)}'.`,
                        failureMessage,
                    );
                }
            }

            if (missingValues.length) {
                throw new AssertionError(
                    `'${stringify(parent)}' does not have values '${stringify(missingValues)}'.`,
                    failureMessage,
                );
            }

            return parent;
        },
        /**
         * Asserts that an object/array parent includes none of the provided child values through
         * reference equality. Returns the parent value if the assertion passes.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         * const child2 = {b: 'b'};
         *
         * assertWrap.lacksValues({}, [
         *     child,
         *     child2,
         * ]); // returns `{}`;
         * assertWrap.lacksValues({child, child2}, [
         *     child,
         *     child2,
         * ]); // throws an error
         * assertWrap.lacksValues({child: {a: 'a'}, child2}, [
         *     child,
         *     child2,
         * ]); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.lacksValues} : the opposite assertion.
         * - {@link assertWrap.hasValue} : the single-value assertion.
         */
        lacksValues<Parent extends object | string>(
            this: void,
            parent: Parent,
            values: unknown[],
            failureMessage?: string | undefined,
        ): Parent {
            let includedValues: unknown[] = [];

            if (typeof parent === 'string') {
                includedValues = values.filter((value) => {
                    return typeof value === 'string' && parent.includes(value);
                });
            } else {
                try {
                    const actualValues = Reflect.ownKeys(parent).map(
                        (key) => parent[key as keyof typeof parent] as unknown,
                    );

                    includedValues = values.filter((value) => {
                        return actualValues.includes(value);
                    });
                } catch {
                    // ignore error
                }
            }

            if (includedValues.length) {
                throw new AssertionError(
                    `'${stringify(parent)}' has values '${stringify(includedValues)}'.`,
                    failureMessage,
                );
            }

            return parent;
        },
        /**
         * Asserts that child value is contained within a parent object, array, or string through
         * reference equality. Returns the child value if the assertion passes.
         *
         * Type guards the child when possible.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         *
         * assertWrap.isIn(child, {child}); // returns `child`;
         * assertWrap.isIn('a', 'ab'); // returns `'a'`;
         * assertWrap.isIn(child, [child]); // returns `child`;
         *
         * assertWrap.isIn(child, {child: {a: 'a'}}); // throws an error
         * assertWrap.isIn('a', 'bc'); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isNotIn} : the opposite assertion.
         */
        isIn<Parent extends object | string, Child>(
            this: void,
            child: Child,
            parent: Parent,
            failureMessage?: string | undefined,
        ): Extract<Child, Values<Parent>> {
            if (!isIn(child, parent)) {
                throw new AssertionError(
                    `'${stringify(child)}'\n\nis not in\n\n${stringify(parent)}.`,
                    failureMessage,
                );
            }

            return child as Extract<Child, Values<Parent>>;
        },
        /**
         * Asserts that child value is _not_ contained within a parent object, array, or string
         * through reference equality. Returns the child value if the assertion passes.
         *
         * Type guards the child when possible.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         *
         * assertWrap.isNotIn(child, {child}); // throws an error
         * assertWrap.isNotIn('a', 'ab'); // throws an error
         * assertWrap.isNotIn(child, [child]); // throws an error
         *
         * assertWrap.isNotIn(child, {child: {a: 'a'}}); // returns `child`;
         * assertWrap.isNotIn('a', 'bc'); // returns `'a'`;
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isIn} : the opposite assertion.
         */
        isNotIn<Parent extends object | string, Child>(
            this: void,
            child: Child,
            parent: Parent,
            failureMessage?: string | undefined,
        ): Exclude<Child, Values<Parent>> {
            if (isIn(child, parent)) {
                throw new AssertionError(
                    `'${stringify(child)}'\n\nis in\n\n${stringify(parent)}.`,
                    failureMessage,
                );
            }

            return child as Exclude<Child, Values<Parent>>;
        },
        /**
         * Asserts that a value is empty. Supports strings, Maps, Sets, objects, and arrays. Returns
         * the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isEmpty({}); // returns `{}`;
         * assertWrap.isEmpty(''); // returns `''`;
         * assertWrap.isEmpty([]); // returns `[]`;
         *
         * assertWrap.isEmpty('a'); // throws an error
         * assertWrap.isEmpty({a: 'a'}); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isNotEmpty} : the opposite assertion.
         */
        isEmpty<Actual extends CanBeEmpty>(
            this: void,
            actual: Actual,
            failureMessage?: string | undefined,
        ): NarrowToActual<Actual, Empty> {
            if (typeof actual !== 'string' && typeof actual !== 'object') {
                throw new AssertionError(`'${stringify(actual)}' is not empty.`, failureMessage);
            }

            if (typeof actual === 'string' && !actual) {
                // eslint-disable-next-line sonarjs/no-gratuitous-expressions
                if (!actual) {
                    return actual as NarrowToActual<Actual, Empty>;
                }
            } else if (Array.isArray(actual)) {
                if (!actual.length) {
                    return actual as NarrowToActual<Actual, Empty>;
                }
            } else if (actual instanceof Map || actual instanceof Set) {
                if (!actual.size) {
                    return actual as NarrowToActual<Actual, Empty>;
                }
            } else if (typeof actual === 'object' && !Object.keys(actual).length) {
                return actual as NarrowToActual<Actual, Empty>;
            }
            throw new AssertionError(`'${stringify(actual)}' is not empty.`, failureMessage);
        },
        /**
         * Asserts that a value is _not_ empty. Supports strings, Maps, Sets, objects, and arrays.
         * Returns the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isNotEmpty({}); // throws an error
         * assertWrap.isNotEmpty(''); // throws an error
         * assertWrap.isNotEmpty([]); // throws an error
         *
         * assertWrap.isNotEmpty('a'); // returns `'a'`;
         * assertWrap.isNotEmpty({a: 'a'}); // returns `{a: 'a'}`;
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isEmpty} : the opposite assertion.
         */
        isNotEmpty<Actual extends CanBeEmpty>(
            this: void,
            actual: Actual,
            failureMessage?: string | undefined,
        ): Exclude<Actual, Empty> {
            if (typeof actual !== 'string' && typeof actual !== 'object') {
                return actual as Exclude<Actual, Empty>;
            }

            if (typeof actual === 'string' && !actual) {
                // eslint-disable-next-line sonarjs/no-gratuitous-expressions
                if (!actual) {
                    throw new AssertionError(`'${stringify(actual)}' is empty.`, failureMessage);
                }
            } else if (Array.isArray(actual)) {
                if (!actual.length) {
                    throw new AssertionError(`'${stringify(actual)}' is empty.`, failureMessage);
                }
            } else if (actual instanceof Map || actual instanceof Set) {
                if (!actual.size) {
                    throw new AssertionError(`'${stringify(actual)}' is empty.`, failureMessage);
                }
            } else if (typeof actual === 'object' && !Object.keys(actual).length) {
                throw new AssertionError(`'${stringify(actual)}' is empty.`, failureMessage);
            }

            return actual as Exclude<Actual, Empty>;
        },
    },
    checkWrap: {
        /**
         * Checks that an object/array parent includes a child value through reference equality.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         *
         * checkWrap.hasValue({child}, child); // returns `{child}`
         * checkWrap.hasValue({child: {a: 'a'}}, child); // returns `undefined`
         * checkWrap.hasValue([child], child); // returns `[child]`
         * ```
         *
         * @see
         * - {@link checkWrap.lacksValue} : the opposite check.
         * - {@link checkWrap.hasValues} : the multi-value check.
         */
        hasValue<Parent extends object | string>(
            this: void,
            parent: Parent,
            value: unknown,
        ): Parent | undefined {
            if (hasValue(parent, value)) {
                return parent;
            } else {
                return undefined;
            }
        },
        /**
         * Checks that an object/array parent does _not_ include a child value through reference
         * equality.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         *
         * checkWrap.lacksValue({child}, child); // returns `undefined`
         * checkWrap.lacksValue({child: {a: 'a'}}, child); // returns `{child: {a: 'a'}}`
         * checkWrap.lacksValue([child], child); // returns `undefined`
         * ```
         *
         * @see
         * - {@link checkWrap.hasValue} : the opposite check.
         * - {@link checkWrap.lacksValues} : the multi-value check.
         */
        lacksValue<Parent extends object | string>(
            this: void,
            parent: Parent,
            value: unknown,
        ): Parent | undefined {
            if (hasValue(parent, value)) {
                return undefined;
            } else {
                return parent;
            }
        },
        /**
         * Checks that an object/array parent includes all child values through reference equality.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         * const child2 = {b: 'b'};
         *
         * checkWrap.hasValues({child, child2}, [
         *     child,
         *     child2,
         * ]); // returns `{child, child2}`
         * checkWrap.hasValues({child: {a: 'a'}, child2}, [
         *     child,
         *     child2,
         * ]); // returns `undefined`
         * checkWrap.hasValues(
         *     [child],
         *     [
         *         child,
         *         child2,
         *     ],
         * ); // returns `[child]`
         * ```
         *
         * @see
         * - {@link checkWrap.lacksValues} : the opposite check.
         * - {@link checkWrap.hasValue} : the single-value check.
         */
        hasValues<Parent extends object | string>(
            this: void,
            parent: Parent,
            values: unknown[],
        ): Parent | undefined {
            if (values.every((value) => hasValue(parent, value))) {
                return parent;
            } else {
                return undefined;
            }
        },
        /**
         * Checks that an object/array parent includes none of the provided child values through
         * reference equality.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         * const child2 = {b: 'b'};
         *
         * checkWrap.lacksValues({}, [
         *     child,
         *     child2,
         * ]); // returns `{}`
         * checkWrap.lacksValues({child, child2}, [
         *     child,
         *     child2,
         * ]); // returns `undefined`
         * checkWrap.lacksValues({child: {a: 'a'}, child2}, [
         *     child,
         *     child2,
         * ]); // returns `undefined`
         * ```
         *
         * @see
         * - {@link checkWrap.lacksValues} : the opposite check.
         * - {@link checkWrap.hasValue} : the single-value check.
         */
        lacksValues<Parent extends object | string>(
            this: void,
            parent: Parent,
            values: unknown[],
        ): Parent | undefined {
            if (values.every((value) => hasValue(parent, value))) {
                return undefined;
            } else {
                return parent;
            }
        },
        /**
         * Checks that child value is contained within a parent object, array, or string through
         * reference equality.
         *
         * Type guards the child when possible.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         *
         * checkWrap.isIn(child, {child}); // returns `child`
         * checkWrap.isIn('a', 'ab'); // returns `'a'`
         * checkWrap.isIn(child, [child]); // returns `child`
         *
         * checkWrap.isIn(child, {child: {a: 'a'}}); // returns `undefined`
         * checkWrap.isIn('a', 'bc'); // returns `undefined`
         * ```
         *
         * @see
         * - {@link checkWrap.isNotIn} : the opposite check.
         */
        isIn<Parent extends object | string, Child>(
            this: void,
            child: Child,
            parent: Parent,
        ): Extract<Child, Values<Parent>> | undefined {
            if (isIn(child, parent)) {
                return child as Extract<Child, Values<Parent>>;
            } else {
                return undefined;
            }
        },
        /**
         * Checks that child value is _not_ contained within a parent object, array, or string
         * through reference equality.
         *
         * Type guards the child when possible.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         *
         * checkWrap.isNotIn(child, {child}); // returns `undefined`
         * checkWrap.isNotIn('a', 'ab'); // returns `undefined`
         * checkWrap.isNotIn(child, [child]); // returns `undefined`
         *
         * checkWrap.isNotIn(child, {child: {a: 'a'}}); // returns `child`
         * checkWrap.isNotIn('a', 'bc'); // returns `'a'`
         * ```
         *
         * @see
         * - {@link checkWrap.isIn} : the opposite check.
         */
        isNotIn<Parent extends object | string, Child>(
            this: void,
            child: Child,
            parent: Parent,
        ): Exclude<Child, Values<Parent>> | undefined {
            if (isIn(child, parent)) {
                return undefined;
            } else {
                return child as Exclude<Child, Values<Parent>>;
            }
        },
        /**
         * Checks that a value is empty. Supports strings, Maps, Sets, objects, and arrays.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isEmpty({}); // returns `{}`
         * checkWrap.isEmpty(''); // returns `''`
         * checkWrap.isEmpty([]); // returns `[]`
         *
         * checkWrap.isEmpty('a'); // returns `undefined`
         * checkWrap.isEmpty({a: 'a'}); // returns `undefined`
         * ```
         *
         * @see
         * - {@link checkWrap.isNotEmpty} : the opposite check.
         */
        isEmpty<Actual extends CanBeEmpty>(
            this: void,
            actual: Actual,
        ): NarrowToActual<Actual, Empty> | undefined {
            if (typeof actual !== 'string' && typeof actual !== 'object') {
                return undefined;
            }

            if (typeof actual === 'string') {
                if (!actual) {
                    return actual as NarrowToActual<Actual, Empty>;
                }
            } else if (Array.isArray(actual)) {
                if (!actual.length) {
                    return actual as NarrowToActual<Actual, Empty>;
                }
            } else if (actual instanceof Map || actual instanceof Set) {
                if (!actual.size) {
                    return actual as NarrowToActual<Actual, Empty>;
                }
            } else if (typeof actual === 'object' && !Object.keys(actual).length) {
                return actual as NarrowToActual<Actual, Empty>;
            }

            return undefined;
        },
        /**
         * Checks that a value is _not_ empty. Supports strings, Maps, Sets, objects, and arrays.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isNotEmpty({}); // returns `undefined`
         * checkWrap.isNotEmpty(''); // returns `undefined`
         * checkWrap.isNotEmpty([]); // returns `undefined`
         *
         * checkWrap.isNotEmpty('a'); // returns `'a'`
         * checkWrap.isNotEmpty({a: 'a'}); // returns `{a: 'a'}`
         * ```
         *
         * @see
         * - {@link checkWrap.isEmpty} : the opposite check.
         */
        isNotEmpty<Actual extends CanBeEmpty>(
            this: void,
            actual: Actual,
        ): Exclude<Actual, Empty> | undefined {
            if (typeof actual !== 'string' && typeof actual !== 'object') {
                return actual as Exclude<Actual, Empty>;
            }

            if (typeof actual === 'string') {
                if (!actual) {
                    return undefined;
                }
            } else if (Array.isArray(actual)) {
                if (!actual.length) {
                    return undefined;
                }
            } else if (actual instanceof Map || actual instanceof Set) {
                if (!actual.size) {
                    return undefined;
                }
            } else if (typeof actual === 'object' && !Object.keys(actual).length) {
                return undefined;
            }

            return actual as Exclude<Actual, Empty>;
        },
    },
    waitUntil: {
        /**
         * Repeatedly calls a callback until its output is an object/array parent includes a child
         * value through reference equality. Once the callback output passes, it is returned. If the
         * attempts time out, an error is thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         *
         * await waitUntil.hasValue(child, () => {
         *     return {child};
         * }); // returns `{child}`;
         * await waitUntil.hasValue(child, () => {
         *     return {child: {a: 'a'}};
         * }); // throws an error
         * await waitUntil.hasValue(child, () => [child]); // returns `[child]`;
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.lacksValue} : the opposite assertion.
         * - {@link waitUntil.hasValues} : the multi-value assertion.
         */
        hasValue: createWaitUntil(assertions.hasValue) as <Parent extends object | string>(
            this: void,
            value: unknown,
            callback: () => MaybePromise<Parent>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Parent>,
        /**
         * Repeatedly calls a callback until its output is an object/array parent does _not_ include
         * a child value through reference equality. Once the callback output passes, it is
         * returned. If the attempts time out, an error is thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         *
         * await waitUntil.lacksValue(child, () => {
         *     return {child};
         * }); // throws an error
         * await waitUntil.lacksValue(child, () => {
         *     return {child: {a: 'a'}};
         * }); // returns `{child: {a: 'a'}}`;
         * await waitUntil.lacksValue(child, () => [child]); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.hasValue} : the opposite assertion.
         * - {@link waitUntil.lacksValues} : the multi-value assertion.
         */
        lacksValue: createWaitUntil(assertions.lacksValue) as <Parent extends object | string>(
            this: void,
            value: unknown,
            callback: () => MaybePromise<Parent>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Parent>,
        /**
         * Repeatedly calls a callback until its output is an object/array parent includes all child
         * values through reference equality. Once the callback output passes, it is returned. If
         * the attempts time out, an error is thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         * const child2 = {b: 'b'};
         *
         * await waitUntil.hasValues(
         *     [
         *         child,
         *         child2,
         *     ],
         *     () => {
         *         return {child, child2};
         *     },
         * ); // returns `{child, child2}`;
         * await waitUntil.hasValues(
         *     [
         *         child,
         *         child2,
         *     ],
         *     () => {
         *         return {child: {a: 'a'}, child2};
         *     },
         * ); // throws an error
         * await waitUntil.hasValues(
         *     [
         *         child,
         *         child2,
         *     ],
         *     () => [child],
         * ); // returns `[child]`;
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.lacksValues} : the opposite assertion.
         * - {@link waitUntil.hasValue} : the single-value assertion.
         */
        hasValues: createWaitUntil(assertions.hasValues) as <Parent extends object | string>(
            this: void,
            value: unknown[],
            callback: () => MaybePromise<Parent>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Parent>,
        /**
         * Repeatedly calls a callback until its output is an object/array parent includes none of
         * the provided child values through reference equality. Once the callback output passes, it
         * is returned. If the attempts time out, an error is thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         * const child2 = {b: 'b'};
         *
         * await waitUntil.lacksValues(
         *     [
         *         child,
         *         child2,
         *     ],
         *     () => {
         *         return {};
         *     },
         * ); // returns `{}`;
         * await waitUntil.lacksValues(
         *     [
         *         child,
         *         child2,
         *     ],
         *     () => {
         *         return {child, child2};
         *     },
         * ); // throws an error
         * await waitUntil.lacksValues(
         *     [
         *         child,
         *         child2,
         *     ],
         *     () => {
         *         return {child: {a: 'a'}, child2};
         *     },
         * ); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.lacksValues} : the opposite assertion.
         * - {@link waitUntil.hasValue} : the single-value assertion.
         */
        lacksValues: createWaitUntil(assertions.lacksValues) as <Parent extends object | string>(
            this: void,
            value: unknown[],
            callback: () => MaybePromise<Parent>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Parent>,
        /**
         * Repeatedly calls a callback until its output is child value is contained within a parent
         * object, array, or string through reference equality. Once the callback output passes, it
         * is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the child when possible.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         *
         * await waitUntil.isIn({child}, () => child); // returns `child`
         * await waitUntil.isIn('ab', () => 'a'); // returns `'a'`
         * await waitUntil.isIn(child, () => [child]); // returns `child`
         *
         * await waitUntil.isIn({child: {a: 'a'}}, () => child); // throws an error
         * await waitUntil.isIn('bc', () => 'a'); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isNotIn} : the opposite assertion.
         */
        isIn: createWaitUntil(assertions.isIn) as <Child, Parent>(
            this: void,
            parent: Parent,
            callback: () => MaybePromise<Child>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<NarrowToExpected<Child, Values<Parent>>>,
        /**
         * Repeatedly calls a callback until its output is child value is _not_ contained within a
         * parent object, array, or string through reference equality. Once the callback output
         * passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the child when possible.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * const child = {a: 'a'};
         *
         * await waitUntil.isNotIn({child}, () => child); // throws an error
         * await waitUntil.isNotIn('ab', () => 'a'); // throws an error
         * await waitUntil.isNotIn([child], () => child); // throws an error
         *
         * await waitUntil.isNotIn({child: {a: 'a'}}, () => child); // returns `child`;
         * await waitUntil.isNotIn('bc', () => 'a'); // returns `'a'`;
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isIn} : the opposite assertion.
         */
        isNotIn: createWaitUntil(assertions.isNotIn) as <Child, Parent>(
            this: void,
            parent: Parent,
            callback: () => MaybePromise<Child>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Exclude<Child, Values<Parent>>>,
        /**
         * Repeatedly calls a callback until its output is a value is empty. Supports strings, Maps,
         * Sets, objects, and arrays. Once the callback output passes, it is returned. If the
         * attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isEmpty(() => {
         *     return {};
         * }); // returns `{}`;
         * await waitUntil.isEmpty(() => ''); // returns `''`;
         * await waitUntil.isEmpty(() => []); // returns `[]`;
         *
         * await waitUntil.isEmpty(() => 'a'); // throws an error
         * await waitUntil.isEmpty(() => {
         *     return {a: 'a'};
         * }); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isNotEmpty} : the opposite assertion.
         */
        isEmpty: createWaitUntil(assertions.isEmpty) as <Actual extends CanBeEmpty>(
            this: void,
            callback: () => MaybePromise<Actual>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<NarrowToActual<Actual, Empty>>,
        /**
         * Repeatedly calls a callback until its output is a value is _not_ empty. Supports strings,
         * Maps, Sets, objects, and arrays. Once the callback output passes, it is returned. If the
         * attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isNotEmpty(() => {
         *     return {};
         * }); // throws an error
         * await waitUntil.isNotEmpty(() => ''); // throws an error
         * await waitUntil.isNotEmpty(() => []); // throws an error
         *
         * await waitUntil.isNotEmpty(() => 'a'); // returns `'a'`;
         * await waitUntil.isNotEmpty(() => {
         *     return {a: 'a'};
         * }); // returns `{a: 'a'}`;
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isEmpty} : the opposite assertion.
         */
        isNotEmpty: createWaitUntil(assertions.isNotEmpty) as <Actual extends CanBeEmpty>(
            this: void,
            callback: () => MaybePromise<Actual>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Exclude<Actual, Empty>>,
    },
} satisfies GuardGroup<typeof assertions>;
