import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {ifTruthy} from './if-truthy.js';

describe(ifTruthy.name, () => {
    itCases(ifTruthy, [
        {
            it: 'triggers the truthy callback',
            inputs: [
                true,
                () => 'hi',
                () => 'bye',
            ],
            expect: 'hi',
        },
        {
            it: 'triggers the falsy callback',
            inputs: [
                false,
                () => 'hi',
                () => 'bye',
            ],
            expect: 'bye',
        },
    ]);

    it('has proper types', () => {
        assert
            .tsType(
                ifTruthy(
                    true,
                    () => 'hi',
                    () => 4,
                ),
            )
            .equals<string | number>();
        assert
            .tsType(
                ifTruthy(
                    true,
                    () => 'hi',
                    () => 'hi',
                ),
            )
            .equals<string>();
    });
});
