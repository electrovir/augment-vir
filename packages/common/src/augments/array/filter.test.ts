import {assert, describe, isTruthy, it, itCases} from '@augment-vir/test';
import {filterMap, filterOutIndexes} from './filter.js';

describe(filterOutIndexes.name, () => {
    const exampleArray = [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
    ];

    itCases(filterOutIndexes, [
        {
            it: 'removes entries by index',
            inputs: [
                exampleArray,
                [
                    1,
                    4,
                    5,
                    6,
                ],
            ],
            expect: [
                'a',
                'c',
                'd',
            ],
        },
        {
            it: "doesn't do anything if no indexes are given to remove",
            inputs: [
                exampleArray,
                [],
            ],
            expect: exampleArray,
        },
    ]);

    it('does not modify the original array', () => {
        filterOutIndexes(
            exampleArray,
            [
                1,
                4,
                5,
                6,
            ],
        );
        assert.deepStrictEqual(exampleArray, [
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
        ]);
    });
});

describe(filterMap.name, () => {
    itCases(filterMap, [
        {
            it: 'handles an empty array',
            inputs: [
                [],
                (entry: any) => entry * 2,
                (mappedEntry: any) => mappedEntry > 10,
            ],
            expect: [],
        },
        {
            it: 'maps and filters',
            inputs: [
                [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                ],
                (entry: any) => entry * 2,
                (mappedEntry: any) => mappedEntry > 10,
            ],
            expect: [12],
        },
    ]);

    it('has proper types', () => {
        const exampleArray = [
            '1',
            '2',
            '3',
            '4',
            '5',
            'fake number',
            '1,123',
            '6',
        ];

        const output = filterMap(
            exampleArray,
            (entry, index, originalArray) => {
                assert.tsType(entry).equals<string>();
                assert.tsType(index).equals<number>();
                assert.tsType(originalArray).equals<ReadonlyArray<string>>();

                return Number(entry);
            },
            (mapped, entry, index, originalArray) => {
                assert.tsType(mapped).equals<number>();
                assert.tsType(entry).equals<string>();
                assert.tsType(index).equals<number>();
                assert.tsType(originalArray).equals<ReadonlyArray<string>>();
                return !isNaN(mapped);
            },
        );

        assert.tsType(output).equals<number[]>();

        assert.deepStrictEqual(
            output,
            [
                1,
                2,
                3,
                4,
                5,
                6,
            ],
        );
    });

    it('supports type guard filters', () => {
        const exampleArray = [
            '1',
            '2',
            '3',
            '4',
            '5',
            'fake number',
            '1,123',
            '6',
        ];

        const output = filterMap(
            exampleArray,
            (entry) => {
                const numeric = Number(entry);
                return numeric % 2 ? numeric : undefined;
            },
            isTruthy,
        );
        assert.tsType(output).equals<number[]>();
        assert.deepStrictEqual(
            output,
            [
                1,
                3,
                5,
            ],
        );
    });
});
