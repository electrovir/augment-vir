import {ExpectTypeOf} from 'expect-type';
import type {GuardGroup} from '../../guard-types/guard-group.js';

type AssertTypeOf<TestingType> = {
    equals: ExpectTypeOf<TestingType, true>['toEqualTypeOf'];
    notEquals: ExpectTypeOf<TestingType, false>['toEqualTypeOf'];
    matches: ExpectTypeOf<TestingType, true>['toMatchTypeOf'];
    notMatches: ExpectTypeOf<TestingType, false>['toMatchTypeOf'];
};

function tsType<Actual>(
    /** Run-time value to type check. */
    // eslint-disable-next-line @typescript-eslint/unified-signatures
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

const assertions: {tsType: typeof tsType} = {
    tsType,
};

export const tsTypeGuards = {
    assertions,
} satisfies GuardGroup;
