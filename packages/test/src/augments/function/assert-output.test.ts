import {describe} from '../universal-testing-suite/universal-describe.js';
import {assertOutput} from './assert-output.js';

describe(assertOutput.name, ({itCases, it}) => {
    it('has proper types', () => {
        try {
            assertOutput(
                (input: number) => String(input),
                // @ts-expect-error should require the expectation to match the function output
                5,
                42,
            );
            assertOutput((input: number) => String(input), '5', 42);
            assertOutput(
                (input: number) => String(input),
                '5',
                // @ts-expect-error this should be a number
                'wrong type',
            );
            assertOutput((input: number, input2: string) => String(input), '5', 5, 'word');
        } catch {
            // ignore all run-time errors here, this is just for type checking
        }
    });

    itCases(assertOutput, [
        {
            it: 'passes when the values match',
            inputs: [
                () => 'five',
                'five',
            ],
            throws: undefined,
        },
        {
            it: 'passes when the values match with inputs',
            inputs: [
                (a: string, b: number) =>
                    [
                        a,
                        b,
                    ].join(','),
                'first,45',
                'first',
                45,
            ],
            throws: undefined,
        },
        {
            it: 'fails when the values do not match',
            inputs: [
                () => 'sixty',
                'fifty',
            ],
            throws: {
                matchConstructor: Error,
            },
        },
        {
            it: 'fails when the values do not match with inputs',
            inputs: [
                (a: string, b: number) =>
                    [
                        a,
                        b,
                    ].join(','),
                'second,67',
                'second',
                67,
            ],
            throws: undefined,
        },
        {
            it: 'passes for deep equality',
            inputs: [
                () => {
                    return {
                        value: 'four',
                    };
                },
                {value: 'four'},
            ],
            throws: undefined,
        },
        {
            it: 'passes for deep equality with inputs',
            inputs: [
                (a: string, b: number) => {
                    return {
                        value: [
                            a,
                            b,
                        ].join(','),
                    };
                },
                {value: `other,46`},
                'other',
                46,
            ],
            throws: undefined,
        },
        {
            it: 'fails for deep inequality',
            inputs: [
                () => {
                    return {
                        value: 'seventy-two',
                    };
                },
                {value: 'thirty-three'},
            ],
            throws: {
                matchConstructor: Error,
            },
        },
    ]);
});
