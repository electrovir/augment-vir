import {ExpectTypeOf} from 'expect-type';
import type {GuardGroup} from '../../augments/guard-types/guard-group.js';

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

const assertions: {tsType: typeof tsType} = {
    tsType,
};

export const tsTypeGuards = {
    assertions,
} satisfies GuardGroup;
