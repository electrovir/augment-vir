import {Overwrite} from '@augment-vir/common';
import {ExpectTypeOf, Not} from 'expect-type';

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

export function assertTypeOf<TestingType>(input: TestingType): AssertTypeOf<TestingType, true>;
export function assertTypeOf<TestingType>(): AssertTypeOf<TestingType, true>;
export function assertTypeOf<TestingType>(input?: TestingType): AssertTypeOf<TestingType, true> {
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
