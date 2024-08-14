import {assert} from '@augment-vir/assert';
import {
    BaseTestCase,
    FunctionTestCase,
    itCases,
    OutputTestCaseMultipleInputs,
    OutputTestCaseSingleInput,
} from './it-cases.js';
import {describe} from './universal-describe.js';
import {it} from './universal-it.js';

describe('itCases', () => {
    itCases(
        () => true,
        (actual, expected) => assert.isTrue(actual === expected),
        [
            {
                it: 'stuff',
                expect: true,
            },
        ],
    );
    itCases(
        () => true,
        [
            {
                it: 'stuff',
                expect: true,
            },
        ],
    );

    itCases(() => {
        throw new Error();
    }, [
        {
            it: 'passes when an expected error is caught',
            throws: {
                matchConstructor: Error,
            },
        },
    ]);
    itCases(() => {}, [
        {
            it: 'passes when no errors are thrown',
            throws: undefined,
        },
    ]);

    itCases(() => {
        return true;
    }, [
        {
            it: 'passes',
            expect: true,
        },
        {
            it: 'excludes this test',
            expect: false,
            skip: true,
        },
    ]);

    // with readonly rest params
    itCases(
        (...inputs: ReadonlyArray<string>) => {
            return true;
        },
        [
            {
                it: 'passes',
                expect: true,
                inputs: [
                    'derp',
                    'derp',
                ],
            },
            {
                it: 'excludes this test',
                expect: false,
                skip: true,
                inputs: [],
            },
        ],
    );
    itCases(
        (input: Partial<RequestInit>) => true,
        [
            {
                it: 'supports auto complete',
                input: {
                    body: null,
                },
                expect: true,
            },
        ],
    );
});

describe('FunctionTestCase', () => {
    it('handles functions with no inputs', () => {
        assert.tsType<FunctionTestCase<() => number>>().equals<BaseTestCase<number>>();
        assert.tsType<FunctionTestCase<() => string>>().notEquals<BaseTestCase<number>>();
        assert.tsType<FunctionTestCase<() => string>>().equals<BaseTestCase<string>>();
    });
    it('handles functions with just one input', () => {
        assert
            .tsType<FunctionTestCase<(input: string) => string>>()
            .equals<OutputTestCaseSingleInput<(input: string) => string>>();
        assert
            .tsType<FunctionTestCase<(input?: string | undefined) => string>>()
            .equals<OutputTestCaseSingleInput<(input: string | undefined) => string>>();

        const testAssignment: FunctionTestCase<(input1?: string) => string> = {} as any;
    });
    it('handles functions with multiple inputs', () => {
        const testAssignment: FunctionTestCase<(input1: string, input2: number) => string> =
            {} as any;
        assert.tsType(testAssignment.inputs).equals<[string, number]>();

        assert
            .tsType<FunctionTestCase<(input1: string, input2: number) => string>>()
            .equals<OutputTestCaseMultipleInputs<(input: string, input2: number) => string>>();
        assert
            .tsType<FunctionTestCase<(input1: string, input2: number) => string>>()
            .equals<OutputTestCaseMultipleInputs<(input: string, input2: number) => string>>();
    });

    it('handles functions with rest inputs', () => {
        const testAssignment: FunctionTestCase<(...allInputs: ReadonlyArray<string>) => string> =
            {} as any;
        assert.tsType(testAssignment.inputs).equals<string[]>();

        assert
            .tsType<FunctionTestCase<(...allInputs: ReadonlyArray<string>) => string>>()
            .equals<
                OutputTestCaseMultipleInputs<(...allInputs: ReadonlyArray<string>) => string>
            >();
    });

    it('handles functions with rest inputs and non-rest inputs', () => {
        const testAssignment: FunctionTestCase<
            (input: number, ...allInputs: ReadonlyArray<string>) => string
        > = {} as any;
        assert.tsType(testAssignment.inputs).equals<[number, ...string[]]>();

        assert
            .tsType<FunctionTestCase<(...allInputs: ReadonlyArray<string>) => string>>()
            .equals<
                OutputTestCaseMultipleInputs<(...allInputs: ReadonlyArray<string>) => string>
            >();
    });
});
