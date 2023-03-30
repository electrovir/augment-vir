import {assert} from 'chai';
import {describe, it} from 'mocha';
import {assertTypeOf} from './assert-type-of';
import {
    BaseTestCase,
    FunctionTestCase,
    OutputTestCaseMultipleInputs,
    OutputTestCaseSingleInput,
    itCases,
} from './it-cases';

describe(itCases.name, () => {
    const genericItCasesOptions = {assert, it, forceIt: it.only, excludeIt: it.skip};

    itCases(
        genericItCasesOptions,
        () => {
            throw new Error();
        },
        [
            {
                throws: Error,
                it: 'should pass when an expected error is caught',
            },
        ],
    );
    itCases(genericItCasesOptions, () => {}, [
        {
            throws: undefined,
            it: 'should pass when no errors are thrown',
        },
    ]);

    itCases(
        genericItCasesOptions,
        () => {
            return true;
        },
        [
            {
                it: 'should pass',
                expect: true,
            },
            {
                it: 'should exclude this test',
                expect: false,
                exclude: true,
            },
        ],
    );

    // with readonly rest params
    itCases(
        genericItCasesOptions,
        (...inputs: ReadonlyArray<string>) => {
            return true;
        },
        [
            {
                it: 'should pass',
                expect: true,
                inputs: [
                    'derp',
                    'derp',
                ],
            },
            {
                it: 'should exclude this test',
                expect: false,
                exclude: true,
                inputs: [],
            },
        ],
    );
});

describe('FunctionTestCase', () => {
    it('handles functions with no inputs', () => {
        assertTypeOf<FunctionTestCase<() => number>>().toEqualTypeOf<BaseTestCase<number>>();
        assertTypeOf<FunctionTestCase<() => string>>().not.toEqualTypeOf<BaseTestCase<number>>();
        assertTypeOf<FunctionTestCase<() => string>>().toEqualTypeOf<BaseTestCase<string>>();
    });
    it('handles functions with just one input', () => {
        assertTypeOf<FunctionTestCase<(input: string) => string>>().toEqualTypeOf<
            OutputTestCaseSingleInput<(input: string) => string>
        >();
        assertTypeOf<FunctionTestCase<(input?: string | undefined) => string>>().toEqualTypeOf<
            OutputTestCaseSingleInput<(input: string | undefined) => string>
        >();

        const testAssignment: FunctionTestCase<(input1?: string) => string> = {} as any;
        testAssignment.input;
    });
    it('handles functions with multiple inputs', () => {
        const testAssignment: FunctionTestCase<(input1: string, input2: number) => string> =
            {} as any;
        assertTypeOf(testAssignment.inputs).toEqualTypeOf<[string, number]>();

        assertTypeOf<FunctionTestCase<(input1: string, input2: number) => string>>().toEqualTypeOf<
            OutputTestCaseMultipleInputs<(input: string, input2: number) => string>
        >();
        assertTypeOf<FunctionTestCase<(input1: string, input2: number) => string>>().toEqualTypeOf<
            OutputTestCaseMultipleInputs<(input: string, input2: number) => string>
        >();
    });

    it('handles functions with rest inputs', () => {
        const testAssignment: FunctionTestCase<(...allInputs: ReadonlyArray<string>) => string> =
            {} as any;
        assertTypeOf(testAssignment.inputs).toEqualTypeOf<string[]>();

        assertTypeOf<
            FunctionTestCase<(...allInputs: ReadonlyArray<string>) => string>
        >().toEqualTypeOf<
            OutputTestCaseMultipleInputs<(...allInputs: ReadonlyArray<string>) => string>
        >();
    });

    it('handles functions with rest inputs and non-rest inputs', () => {
        const testAssignment: FunctionTestCase<
            (input: number, ...allInputs: ReadonlyArray<string>) => string
        > = {} as any;
        assertTypeOf(testAssignment.inputs).toEqualTypeOf<[number, ...string[]]>();

        assertTypeOf<
            FunctionTestCase<(...allInputs: ReadonlyArray<string>) => string>
        >().toEqualTypeOf<
            OutputTestCaseMultipleInputs<(...allInputs: ReadonlyArray<string>) => string>
        >();
    });
});
