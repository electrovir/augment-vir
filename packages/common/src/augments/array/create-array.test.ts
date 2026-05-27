import {assert} from '@augment-vir/assert';
import {waitValue} from '@augment-vir/core';
import {describe, it, itCases} from '@augment-vir/test';
import {randomBoolean} from '../random/random-boolean.js';
import {createArray} from './create-array.js';

describe(createArray.name, () => {
    itCases(createArray, [
        {
            it: 'handles a sync callback',
            inputs: [
                3,
                (index) => `hi ${index}`,
            ],
            expect: [
                'hi 0',
                'hi 1',
                'hi 2',
            ],
        },
        {
            it: 'handles maybe async callback',
            inputs: [
                3,
                (index) => {
                    const value = `hi ${index}`;

                    if (randomBoolean()) {
                        return Promise.resolve(value);
                    } else {
                        return value;
                    }
                },
            ],
            expect: [
                'hi 0',
                'hi 1',
                'hi 2',
            ],
        },
        {
            it: 'handles async callbacks',
            inputs: [
                3,
                async (index) => {
                    return waitValue(
                        {
                            milliseconds: 1,
                        },
                        `hi ${index}`,
                    );
                },
            ],
            expect: [
                'hi 0',
                'hi 1',
                'hi 2',
            ],
        },
    ]);

    it("doesn't explode TypeScript on huge numbers", () => {
        assert.tsType(createArray(5000, () => 'hi')).equals<string[]>();
    });

    it('works with a generic', () => {
        function wrapper<T extends number>(value: T) {
            return createArray(value, () => 'hi');
        }

        assert.tsType(wrapper(5000)).equals<string[]>();
        assert.tsType(wrapper(2)).equals<
            [
                string,
                string,
            ]
        >();
        assert.tsType(createArray(5000 as number, () => 'hi')).equals<string[]>();
    });

    it('has correct return type', () => {
        assert.tsType(createArray(3, () => 'hi')).equals<
            [
                string,
                string,
                string,
            ]
        >();
        assert
            .tsType(
                createArray(3, () => {
                    return Promise.resolve('hi');
                }),
            )
            .equals<
                Promise<
                    [
                        string,
                        string,
                        string,
                    ]
                >
            >();
        assert
            .tsType(
                createArray(3, () => {
                    if (randomBoolean()) {
                        return Promise.resolve('hi');
                    } else {
                        return 'hi';
                    }
                }),
            )
            .equals<
                Promise<
                    [
                        string,
                        string,
                        string,
                    ]
                >
            >();
    });
});
