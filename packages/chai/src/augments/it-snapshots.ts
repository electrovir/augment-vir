import {AnyFunction, assertRuntimeTypeOf, createDeferredPromiseWrapper} from '@augment-vir/common';
import {CompareExpectationsOptions, assertExpectedOutput} from 'test-established-expectations';

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

export function itSnapshots<FunctionToTestGeneric extends AnyFunction, DescribeKey extends string>(
    functionToTest: FunctionToTestGeneric,
    describeKey: '' extends DescribeKey
        ? DoesNotAcceptEmptyString
        : DoesNotAcceptEmptyString extends DescribeKey
        ? never
        : DescribeKey,
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
        // add an empty error handler to prevent extraneous errors
        newDeferredPromise.promise.catch(() => null);
        it(snapshotCase.it, async () => {
            try {
                await Promise.all(previousPromises);
            } catch (error) {
                // ignore this errors so that all tests try to run
            }
            try {
                const inputs: Parameters<FunctionToTestGeneric> =
                    'input' in snapshotCase
                        ? ([snapshotCase.input] as Parameters<FunctionToTestGeneric>)
                        : 'inputs' in snapshotCase
                        ? snapshotCase.inputs
                        : ([] as unknown as Parameters<FunctionToTestGeneric>);
                await assertExpectedOutput(
                    functionToTest,
                    {
                        key: {
                            topKey: describeKey,
                            subKey: snapshotCase.it,
                        },
                        ...options,
                    },
                    ...inputs,
                );
                newDeferredPromise.resolve();
            } catch (error) {
                newDeferredPromise.reject(error);
                throw error;
            }
        });

        return currentPromises;
    }, [] as ReadonlyArray<Promise<void>>);
}
