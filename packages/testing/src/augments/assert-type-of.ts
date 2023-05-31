import {Overwrite} from '@augment-vir/common';
import {ExpectTypeOf, ExpectTypeOfOptions, Not} from 'expect-type';

type ExtraTypeChecks<TestingType, B extends ExpectTypeOfOptions> = {
    toBeAssignableTo: ExpectTypeOf<TestingType, B>['toMatchTypeOf'];
};

type WithExtraNotTypeChecks<TestingType, B extends ExpectTypeOfOptions> = Overwrite<
    ExpectTypeOf<TestingType, B>,
    {
        not: ExpectTypeOf<TestingType, B>['not'] &
            ExtraTypeChecks<TestingType, B & {positive: Not<B['positive']>}>;
    }
>;

type AssertTypeOf<TestingType, B extends ExpectTypeOfOptions> = WithExtraNotTypeChecks<
    TestingType,
    B
> &
    ExtraTypeChecks<TestingType, B>;

export function assertTypeOf<TestingType>(
    input: TestingType,
): AssertTypeOf<TestingType, {branded: false; positive: true}>;
export function assertTypeOf<TestingType>(): AssertTypeOf<
    TestingType,
    {branded: false; positive: true}
>;
export function assertTypeOf<TestingType>(
    input?: TestingType,
): AssertTypeOf<TestingType, {branded: false; positive: true}> {
    // run time implementation for this doesn't matter
    const runtimeProxy = new Proxy(
        {},
        {
            get: (target, property) => {
                if (property === 'not') {
                    return runtimeProxy;
                }
                return () => true;
            },
        },
    ) as any;

    return runtimeProxy;
}
