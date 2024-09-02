import type {NarrowToExpected} from '@augment-vir/core';
import {EnumBaseType, getEnumValues, MaybePromise} from '@augment-vir/core';
import {AssertionError} from '../augments/assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {WaitUntilOptions} from '../guard-types/wait-until-function.js';

export function isEnumValue<const Expected extends EnumBaseType>(
    child: unknown,
    checkEnum: Expected,
    failureMessage?: string | undefined,
): asserts child is Expected[keyof Expected] {
    const values = getEnumValues(checkEnum);
    if (!values.includes(child as Expected[keyof Expected])) {
        throw new AssertionError(
            `${String(child)} is not an enum value in '${values.join(',')}'.`,
            failureMessage,
        );
    }
}
function isNotEnumValue<const Actual, const Expected extends EnumBaseType>(
    child: Actual,
    checkEnum: Expected,
    failureMessage?: string | undefined,
): asserts child is Exclude<Actual, Expected[keyof Expected] | `${Expected[keyof Expected]}`> {
    try {
        isEnumValue(child, checkEnum);
    } catch {
        return;
    }

    const values = getEnumValues(checkEnum);
    throw new AssertionError(
        `${String(child)} is an enum value in '${values.join(',')}'`,
        failureMessage,
    );
}

const assertions: {
    /**
     * Asserts that a child value is an enum member.
     *
     * Type guards the child value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * enum MyEnum {
     *     A = 'a',
     *     B = 'b',
     * }
     *
     * assert.isEnumValue('a', MyEnum); // passes
     * assert.isEnumValue('A', MyEnum); // fails
     * ```
     *
     * @throws {@link AssertionError} If the child is not an enum member.
     * @see
     * - {@link assert.isNotEnumValue} : the opposite assertion.
     */
    isEnumValue: typeof isEnumValue;
    /**
     * Asserts that a child value is _not_ an enum member.
     *
     * Type guards the child value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * enum MyEnum {
     *     A = 'a',
     *     B = 'b',
     * }
     *
     * assert.isNotEnumValue('a', MyEnum); // fails
     * assert.isNotEnumValue('A', MyEnum); // passes
     * ```
     *
     * @throws {@link AssertionError} If the child is an enum member.
     * @see
     * - {@link assert.isEnumValue} : the opposite assertion.
     */
    isNotEnumValue: typeof isNotEnumValue;
} = {
    isEnumValue,
    isNotEnumValue,
};

export const enumGuards = {
    assert: assertions,
    check: {
        /**
         * Checks that a child value is an enum member.
         *
         * Type guards the child value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * enum MyEnum {
         *     A = 'a',
         *     B = 'b',
         * }
         *
         * check.isEnumValue('a', MyEnum); // returns `true`
         * check.isEnumValue('A', MyEnum); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isNotEnumValue} : the opposite check.
         */
        isEnumValue:
            autoGuard<
                <const Expected extends EnumBaseType>(
                    child: unknown,
                    checkEnum: Expected,
                ) => child is Expected[keyof Expected]
            >(),
        /**
         * Checks that a child value is _not_ an enum member.
         *
         * Type guards the child value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * enum MyEnum {
         *     A = 'a',
         *     B = 'b',
         * }
         *
         * check.isNotEnumValue('a', MyEnum); // returns `false`
         * check.isNotEnumValue('A', MyEnum); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isEnumValue} : the opposite check.
         */
        isNotEnumValue:
            autoGuard<
                <const Actual, const Expected extends EnumBaseType>(
                    child: Actual,
                    checkEnum: Expected,
                ) => child is Exclude<
                    Actual,
                    Expected[keyof Expected] | `${Expected[keyof Expected]}`
                >
            >(),
    },
    assertWrap: {
        /**
         * Asserts that a child value is an enum member. Returns the child value if the assertion
         * passes.
         *
         * Type guards the child value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * enum MyEnum {
         *     A = 'a',
         *     B = 'b',
         * }
         *
         * assertWrap.isEnumValue('a', MyEnum); // returns `'a'`
         * assertWrap.isEnumValue('A', MyEnum); // throws an error
         * ```
         *
         * @returns The child value if it is an enum member.
         * @throws {@link AssertionError} If the child is not an enum member.
         * @see
         * - {@link assertWrap.isNotEnumValue} : the opposite assertion.
         */
        isEnumValue:
            autoGuard<
                <const Actual, const Expected extends EnumBaseType>(
                    child: Actual,
                    checkEnum: Expected,
                    failureMessage?: string | undefined,
                ) => NarrowToExpected<Actual, Expected[keyof Expected]>
            >(),
        /**
         * Asserts that a child value is _not_ an enum member. Returns the child value if the
         * assertion passes.
         *
         * Type guards the child value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * enum MyEnum {
         *     A = 'a',
         *     B = 'b',
         * }
         *
         * assertWrap.isNotEnumValue('a', MyEnum); // throws an error
         * assertWrap.isNotEnumValue('A', MyEnum); // returns `'A'`
         * ```
         *
         * @returns The child value if it is not an enum member.
         * @throws {@link AssertionError} If the child is an enum member.
         * @see
         * - {@link assertWrap.isEnumValue} : the opposite assertion.
         */
        isNotEnumValue:
            autoGuard<
                <const Actual, const Expected extends EnumBaseType>(
                    child: Actual,
                    checkEnum: Expected,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, Expected[keyof Expected] | `${Expected[keyof Expected]}`>
            >(),
    },
    checkWrap: {
        /**
         * Checks that a child value is an enum member. Returns the child value if the check passes,
         * otherwise `undefined`.
         *
         * Type guards the child value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * enum MyEnum {
         *     A = 'a',
         *     B = 'b',
         * }
         *
         * checkWrap.isEnumValue('a', MyEnum); // returns `'a'`
         * checkWrap.isEnumValue('A', MyEnum); // returns `undefined`
         * ```
         *
         * @returns The child value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isNotEnumValue} : the opposite check.
         */
        isEnumValue:
            autoGuard<
                <const Actual, const Expected extends EnumBaseType>(
                    child: Actual,
                    checkEnum: Expected,
                ) => NarrowToExpected<Actual, Expected[keyof Expected]> | undefined
            >(),
        /**
         * Checks that a child value is _not_ an enum member. Returns the child value if the check
         * passes, otherwise `undefined`.
         *
         * Type guards the child value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * enum MyEnum {
         *     A = 'a',
         *     B = 'b',
         * }
         *
         * checkWrap.isNotEnumValue('a', MyEnum); // returns `undefined`
         * checkWrap.isNotEnumValue('A', MyEnum); // returns `'A'`
         * ```
         *
         * @returns The child value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isEnumValue} : the opposite check.
         */
        isNotEnumValue:
            autoGuard<
                <const Actual, const Expected extends EnumBaseType>(
                    child: Actual,
                    checkEnum: Expected,
                ) =>
                    | Exclude<Actual, Expected[keyof Expected] | `${Expected[keyof Expected]}`>
                    | undefined
            >(),
    },
    waitUntil: {
        /**
         * Repeatedly calls a callback until its output is an enum member. Once the callback output
         * passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * enum MyEnum {
         *     A = 'a',
         *     B = 'b',
         * }
         *
         * await waitUntil.isEnumValue(MyEnum, () => 'a'); // returns `'a'`
         * await waitUntil.isEnumValue(MyEnum, () => 'A'); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isNotEnumValue} : the opposite assertion.
         */
        isEnumValue:
            autoGuard<
                <const Actual, const Expected extends EnumBaseType>(
                    checkEnum: Expected,
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<NarrowToExpected<Actual, Expected[keyof Expected]>>
            >(),
        /**
         * Repeatedly calls a callback until its output is _not_ an enum member. Once the callback
         * output passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * enum MyEnum {
         *     A = 'a',
         *     B = 'b',
         * }
         *
         * await waitUntil.isNotEnumValue(MyEnum, () => 'a'); // throws an error
         * await waitUntil.isNotEnumValue(MyEnum, () => 'A'); // returns `'A'`
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isEnumValue} : the opposite assertion.
         */
        isNotEnumValue:
            autoGuard<
                <const Actual, const Expected extends EnumBaseType>(
                    checkEnum: Expected,
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<
                    Exclude<Actual, Expected[keyof Expected] | `${Expected[keyof Expected]}`>
                >
            >(),
    },
} satisfies GuardGroup<typeof assertions>;
