import {assert} from 'chai';
import {describe, it} from 'mocha';
import {assertOutput} from './assert-output';
import {itCases} from './it-cases';

describe(assertOutput.name, () => {
    it('should have proper types', () => {
        try {
            assertOutput(
                assert,
                (input: number) => String(input),
                // @ts-expect-error should require the expectation to match the function output
                5,
                42,
            );
            assertOutput(assert, (input: number) => String(input), '5', 42);
            assertOutput(
                assert,
                (input: number) => String(input),
                '5',
                // @ts-expect-error this should be a number
                'wrong type',
            );
            assertOutput(assert, (input: number, input2: string) => String(input), '5', 5, 'word');
        } catch (error) {
            // ignore all run-time errors here, this is just for type checking
        }
    });

    itCases({assert, it, forceIt: it.only, excludeIt: it.skip}, assertOutput, [
        {
            it: 'should pass when the values match',
            inputs: [
                assert,
                () => 'five',
                'five',
            ],
            throws: undefined,
        },
        {
            it: 'should pass when the values match with inputs',
            inputs: [
                assert,
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
            it: 'should fails when the values do not match',
            inputs: [
                assert,
                () => 'sixty',
                'fifty',
            ],
            throws: Error,
        },
        {
            it: 'should fails when the values do not match with inputs',
            inputs: [
                assert,
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
            it: 'should pass for deep equality',
            inputs: [
                assert,
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
            it: 'should pass for deep equality with inputs',
            inputs: [
                assert,
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
            it: 'should fail for deep inequality',
            inputs: [
                assert,
                () => {
                    return {
                        value: 'seventy-two',
                    };
                },
                {value: 'thirty-three'},
            ],
            throws: Error,
        },
    ]);
});
