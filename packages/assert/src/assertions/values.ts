import type {NarrowToActual, NarrowToExpected} from '@augment-vir/core';
import {AnyObject, MaybePromise, stringify, Values} from '@augment-vir/core';
import type {EmptyObject} from 'type-fest';
import {AssertionError} from '../augments/assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard, autoGuardSymbol} from '../guard-types/guard-override.js';
import type {WaitUntilOptions} from '../guard-types/wait-until-function.js';

function hasValue(parent: object, value: unknown, failureMessage?: string | undefined) {
    /** Wrap this in a try/catch because `Reflect.ownKeys` can fail depending on what its input is. */
    try {
        const hasValue = Reflect.ownKeys(parent)
            .map((key) => parent[key as keyof typeof parent] as unknown)
            .includes(value);

        if (!hasValue) {
            throw new Error('fail');
        }
    } catch {
        throw new AssertionError(
            `'${stringify(parent)}' does not have value '${stringify(value)}'.`,
            failureMessage,
        );
    }
}
function lacksValue(parent: object, value: unknown, failureMessage?: string | undefined) {
    try {
        hasValue(parent, value);
    } catch {
        return;
    }

    throw new AssertionError(
        `'${stringify(parent)}' has value '${stringify(value)}'.`,
        failureMessage,
    );
}

function hasValues(
    parent: object,
    values: ReadonlyArray<unknown>,
    failureMessage?: string | undefined,
) {
    values.forEach((value) => hasValue(parent, value, failureMessage));
}
function lacksValues(
    parent: object,
    values: ReadonlyArray<unknown>,
    failureMessage?: string | undefined,
) {
    values.forEach((value) => lacksValue(parent, value, failureMessage));
}

export function isIn<const Parent extends object | string>(
    child: unknown,
    parent: Parent,
    failureMessage?: string | undefined,
): asserts child is Values<Parent> {
    if (typeof parent === 'string') {
        if (!parent.includes(child as string)) {
            throw new AssertionError(`${stringify(child)} is not in '${parent}'.`, failureMessage);
        }
    } else {
        hasValue(parent, child, failureMessage);
    }
}
function isNotIn<const Parent extends object | string, const Child>(
    child: Child,
    parent: Parent,
    failureMessage?: string | undefined,
): asserts child is Exclude<Child, Values<Parent>> {
    try {
        isIn(child, parent);
    } catch {
        return;
    }

    throw new AssertionError(`${stringify(child)} is not in ${stringify(parent)}.`, failureMessage);
}

/**
 * All types that can be checked for emptiness. The empty variants of these types are represented in
 * {@link Empty}.
 *
 * @category Assert : Util
 * @category Package : @augment-vir/assert
 * @package @augment-vir/assert
 */
export type CanBeEmpty = string | Map<any, any> | Set<any> | AnyObject | any[];
/**
 * Empty versions of {@link CanBeEmpty}. Note that there is no way to distinguish an empty `Set` or
 * `Map` from their non-empty counterparts in TypeScript (so you will get no emptiness type safety
 * for them.)
 *
 * @category Assert : Util
 * @category Package : @augment-vir/assert
 * @package @augment-vir/assert
 */
export type Empty = '' | EmptyObject | [] | Map<any, any> | Set<any>;

function isEmpty<const Actual extends CanBeEmpty>(
    actual: Actual,
    failureMessage?: string | undefined,
): asserts actual is NarrowToActual<Actual, Empty> {
    const input = actual;

    if (!input) {
        return;
    } else if (typeof input !== 'string' && typeof input !== 'object') {
        throw new TypeError(`Cannot check if '${stringify(input)}' is empty.`);
    } else if (
        (typeof input === 'string' && input) ||
        (Array.isArray(input) && input.length) ||
        (input instanceof Map && input.size) ||
        (input instanceof Set && input.size) ||
        (input && typeof input === 'object' && Object.keys(input).length)
    ) {
        throw new AssertionError(`'${stringify(actual)}' is not empty.`, failureMessage);
    }
}
function isNotEmpty<const Actual extends CanBeEmpty>(
    actual: Actual,
    failureMessage?: string | undefined,
): asserts actual is Exclude<Actual, Empty> {
    try {
        isEmpty(actual);
    } catch {
        return;
    }

    throw new AssertionError(`'${stringify(actual)}' is empty.`, failureMessage);
}

const assertions: {
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
    hasValue: typeof hasValue;
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
    lacksValue: typeof lacksValue;

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
    hasValues: typeof hasValues;

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
    lacksValues: typeof lacksValues;
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
    isIn: typeof isIn;
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
    isNotIn: typeof isNotIn;
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
    isEmpty: typeof isEmpty;
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
    isNotEmpty: typeof isNotEmpty;
} = {
    hasValue,
    lacksValue,
    hasValues,
    lacksValues,
    isIn,
    isNotIn,
    isEmpty,
    isNotEmpty,
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
        hasValue: autoGuardSymbol,
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
        lacksValue: autoGuardSymbol,
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
        hasValues: autoGuardSymbol,
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
        lacksValues: autoGuardSymbol,
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
        isIn: autoGuard<
            <const Parent>(child: unknown, parent: Parent) => child is Values<Parent>
        >(),
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
        isNotIn:
            autoGuard<
                <const Parent, const Child>(
                    child: Child,
                    parent: Parent,
                    failureMessage?: string | undefined,
                ) => child is Exclude<Child, Values<Parent>>
            >(),
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
        isEmpty:
            autoGuard<
                <const Actual extends CanBeEmpty>(
                    actual: Actual,
                ) => actual is NarrowToActual<Actual, Empty>
            >(),
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
        isNotEmpty:
            autoGuard<
                <const Actual extends CanBeEmpty>(
                    actual: Actual,
                ) => actual is Exclude<Actual, Empty>
            >(),
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
        hasValue: autoGuardSymbol,
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
        lacksValue: autoGuardSymbol,
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
        hasValues: autoGuardSymbol,
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
        lacksValues: autoGuardSymbol,
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
        isIn: autoGuard<
            <const Child, const Parent>(
                child: Child,
                parent: Parent,
                failureMessage?: string | undefined,
            ) => NarrowToExpected<Child, Values<Parent>>
        >(),
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
        isNotIn:
            autoGuard<
                <const Parent, const Child>(
                    child: Child,
                    parent: Parent,
                    failureMessage?: string | undefined,
                ) => Exclude<Child, Values<Parent>>
            >(),
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
        isEmpty:
            autoGuard<
                <const Actual extends CanBeEmpty>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => NarrowToActual<Actual, Empty>
            >(),
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
        isNotEmpty:
            autoGuard<
                <const Actual extends CanBeEmpty>(actual: Actual) => Exclude<Actual, Empty>
            >(),
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
        hasValue: autoGuardSymbol,
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
        lacksValue: autoGuardSymbol,
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
        hasValues: autoGuardSymbol,
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
        lacksValues: autoGuardSymbol,
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
        isIn: autoGuard<
            <const Child, const Parent>(
                child: Child,
                parent: Parent,
            ) => NarrowToExpected<Child, Values<Parent>> | undefined
        >(),
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
        isNotIn:
            autoGuard<
                <const Parent, const Child>(
                    child: Child,
                    parent: Parent,
                    failureMessage?: string | undefined,
                ) => Exclude<Child, Values<Parent>> | undefined
            >(),
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
        isEmpty:
            autoGuard<
                <const Actual extends CanBeEmpty>(
                    actual: Actual,
                ) => NarrowToActual<Actual, Empty> | undefined
            >(),
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
        isNotEmpty:
            autoGuard<
                <const Actual extends CanBeEmpty>(
                    actual: Actual,
                ) => Exclude<Actual, Empty> | undefined
            >(),
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
        hasValue: autoGuardSymbol,
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
        lacksValue: autoGuardSymbol,
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
        hasValues: autoGuardSymbol,
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
        lacksValues: autoGuardSymbol,
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
        isIn: autoGuard<
            <const Child, const Parent>(
                parent: Parent,
                callback: () => MaybePromise<Child>,
                options?: WaitUntilOptions | undefined,
                failureMessage?: string | undefined,
            ) => Promise<NarrowToExpected<Child, Values<Parent>>>
        >(),
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
        isNotIn:
            autoGuard<
                <const Child, const Parent>(
                    parent: Parent,
                    callback: () => MaybePromise<Child>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Child, Values<Parent>>>
            >(),
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
        isEmpty:
            autoGuard<
                <const Actual extends CanBeEmpty>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<NarrowToActual<Actual, Empty>>
            >(),
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
        isNotEmpty:
            autoGuard<
                <const Actual extends CanBeEmpty>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, Empty>>
            >(),
    },
} satisfies GuardGroup<typeof assertions>;
