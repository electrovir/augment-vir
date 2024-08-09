/* eslint-disable @typescript-eslint/unified-signatures */
import type {ExpectTypeOf, Not} from 'expect-type';

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

type ExtraTypeChecks<TestingType, B extends boolean> = {
    toBeAssignableTo: ExpectTypeOf<TestingType, B>['toMatchTypeOf'];
};

type WithExtraNotTypeChecks<TestingType, B extends boolean> = Overwrite<
    ExpectTypeOf<TestingType, B>,
    {
        not: ExpectTypeOf<TestingType, B>['not'] & ExtraTypeChecks<TestingType, Not<B>>;
    }
>;

type AssertTypeOf<TestingType, B extends boolean> = WithExtraNotTypeChecks<TestingType, B> &
    ExtraTypeChecks<TestingType, B>;

/**
 * Uses the expect-type package to assert type matching. Does not actually do anything at run-time
 * (like throwing errors).
 */
export function assertTypeOf<TestingType>(
    /** Run-time value to type check. */
    input: TestingType,
): AssertTypeOf<TestingType, true>;
/** Uses the expect-type package to assert type matching. */
export function assertTypeOf<TestingType>(): AssertTypeOf<TestingType, true>;
/** Uses the expect-type package to assert type matching. */
export function assertTypeOf<TestingType>(
    /** Run-time value to type check. */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    input?: TestingType,
): AssertTypeOf<TestingType, true> {
    // run time implementation for this doesn't matter
    const runTimeProxy = new Proxy(
        {},
        {
            get: (target, property) => {
                if (property === 'not') {
                    return runTimeProxy;
                }
                return () => true;
            },
        },
    ) as any;

    return runTimeProxy;
}
