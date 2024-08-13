import {assert} from '@augment-vir/assert';
import {assertTypeOf} from 'run-time-assertions';
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
