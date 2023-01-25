import {AnyFunction, assertRuntimeTypeOf, createDeferredPromiseWrapper} from '@augment-vir/common';
import {assertExpectedOutput, CompareExpectationsOptions} from 'test-established-expectations';

type SnapshotTestBaseCase = {
    it: string;
    force?: true;
};

type SnapshotTestCaseSingleInput<FunctionToTestGeneric extends AnyFunction> = {
    input: Parameters<FunctionToTestGeneric>[0];
} & SnapshotTestBaseCase;

type SnapshotTestCaseMultiInput<FunctionToTestGeneric extends AnyFunction> = {
    inputs: Parameters<FunctionToTestGeneric>;
} & SnapshotTestBaseCase;

type SnapshotTestCase<FunctionToTestGeneric extends AnyFunction> =
    Parameters<FunctionToTestGeneric> extends []
        ? SnapshotTestBaseCase
        : Parameters<FunctionToTestGeneric> extends [any?]
        ? SnapshotTestCaseSingleInput<FunctionToTestGeneric>
        : SnapshotTestCaseMultiInput<FunctionToTestGeneric>;

type DoesNotAcceptEmptyString = 'this function does not accept empty strings';

export function itSnapshots<FunctionToTestGeneric extends AnyFunction, GroupKey extends string>(
    functionToTest: FunctionToTestGeneric,
    snapshotGroupKey: '' extends GroupKey
        ? DoesNotAcceptEmptyString
        : DoesNotAcceptEmptyString extends GroupKey
        ? never
        : GroupKey,
    snapshotCases: void extends ReturnType<FunctionToTestGeneric>
        ? 'functionToTest must return something so its output can be tested.'
        : ReadonlyArray<SnapshotTestCase<FunctionToTestGeneric>>,
    options: Pick<
        CompareExpectationsOptions<any>,
        'cwd' | 'noOverwriteWhenDifferent' | 'showFullError' | 'expectationFile'
    > = {},
) {
    assertRuntimeTypeOf(snapshotCases, 'array', 'snapshotCases input');

    snapshotCases.reduce((previousPromises, snapshotCase) => {
        const newDeferredPromise = createDeferredPromiseWrapper<void>();
        const currentPromises = [
            ...previousPromises,
            newDeferredPromise.promise,
        ];
        it(snapshotCase.it, async () => {
            try {
                await Promise.all(currentPromises);
                await assertExpectedOutput(functionToTest, {
                    key: {
                        topKey: snapshotGroupKey,
                        subKey: snapshotCase.it,
                    },
                    ...options,
                });
                newDeferredPromise.resolve();
            } catch (error) {
                newDeferredPromise.reject(error);
            }
        });

        return currentPromises;
    }, [] as ReadonlyArray<Promise<void>>);
}
