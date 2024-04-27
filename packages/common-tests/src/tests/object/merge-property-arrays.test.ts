import {itCases} from '@augment-vir/chai';
import {mergePropertyArrays} from '@augment-vir/common';
import {assertTypeOf} from 'run-time-assertions';

describe(mergePropertyArrays.name, () => {
    it('has proper types', () => {
        assertTypeOf(
            mergePropertyArrays<{prop1: string[]; prop2?: string[]; prop3?: string[]}>(
                {
                    prop1: ['hi'],
                    prop2: ['bye'],
                },
                {
                    prop1: ['hi2'],
                    prop3: ['another'],
                },
                {
                    prop1: ['hi3'],
                    prop2: ['bye2'],
                    prop3: ['another2'],
                },
            ),
        ).toEqualTypeOf<{
            prop1: string[];
            prop2?: string[];
            prop3?: string[];
        }>();
        assertTypeOf(
            mergePropertyArrays(
                {
                    prop1: ['hi'],
                    prop2: ['bye'],
                },
                {
                    prop1: ['hi2'],
                    // @ts-expect-error: not part of the inferred type parameter
                    prop3: ['another'],
                },
            ),
        ).toEqualTypeOf<{
            prop1: string[];
            prop2: string[];
        }>();
    });

    itCases(mergePropertyArrays, [
        {
            it: 'merges prop arrays',
            inputs: [
                {
                    prop1: ['hi'],
                    prop2: ['bye'],
                },
                {
                    prop1: ['hi2'],
                    prop3: ['another'],
                },
                {
                    prop1: ['hi3'],
                    prop2: ['bye2'],
                    prop3: ['another2'],
                },
            ],
            expect: {
                prop1: [
                    'hi',
                    'hi2',
                    'hi3',
                ],
                prop2: [
                    'bye',
                    'bye2',
                ],
                prop3: [
                    'another',
                    'another2',
                ],
            },
        },
        {
            it: 'returns an empty object for no inputs',
            inputs: [],
            expect: {},
        },
    ]);
});
