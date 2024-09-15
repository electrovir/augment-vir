import {type ExpectTypeOf} from 'expect-type';
import {type GuardGroup} from '../../guard-types/guard-group.js';

type AssertTypeOf<TestingType> = {
    equals: ExpectTypeOf<TestingType, {positive: true}>['toEqualTypeOf'];
    notEquals: ExpectTypeOf<TestingType, {positive: false}>['toEqualTypeOf'];
    matches: ExpectTypeOf<TestingType, {positive: true}>['toMatchTypeOf'];
    notMatches: ExpectTypeOf<TestingType, {positive: false}>['toMatchTypeOf'];
};

function tsType<Actual>(
    /** Run-time value to type check. */

    input: Actual,
): AssertTypeOf<Actual>;
/** Uses the expect-type package to assert type matching. */
function tsType<Actual>(): AssertTypeOf<Actual>;
/** Uses the expect-type package to assert type matching. */
function tsType<Actual>(
    /** Run-time value to type check. */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    input?: Actual,
): AssertTypeOf<Actual> {
    return {
        equals: () => {},
        notEquals: () => {},
        matches: () => {},
        notMatches: () => {},
    } satisfies Record<keyof AssertTypeOf<any>, () => void> as AssertTypeOf<Actual>;
}

const assertions: {
    /**
     * Check if a value or type matches type expectations. Use this to write type tests.
     *
     * This should not be used in production code. It won't cause any issues there, but it also
     * provides no value there.
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.tsType('hello').equals<string>();
     * ```
     */

    /**
     * Asserts within the TypeScript type system that a given type or value matches type
     * expectations (using the [`expect-type`](https://www.npmjs.com/package/expect-type) package.
     * Make sure to call a method on the first call to actually assert anything.
     *
     * Use this to write type tests. Don't use this in production code. It won't cause issues, but
     * it's a useless no-op at run-time (it's not even a type guard).
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.tsType('hello').equals<string>();
     * assert.tsType<'hello>().equals<'hello'>();
     * assert.tsType<'hello>().notEquals<string>();
     * assert.tsType('hello').notEquals<number>();
     * ```
     *
     * @returns Never returns anything.
     * @throws Never throws anything.
     */
    tsType: typeof tsType;
} = {
    tsType,
};

export const tsTypeGuards = {
    assert: assertions,
    assertWrap: {
        tsType: undefined,
    },
    check: {
        tsType: undefined,
    },
    checkWrap: {
        tsType: undefined,
    },
    waitUntil: {
        tsType: undefined,
    },
} satisfies GuardGroup<typeof assertions>;
