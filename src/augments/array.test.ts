import {testGroup} from 'test-vir';
import {filterOutIndexes, flatten2dArray, trimArrayStrings} from './array';

testGroup({
    description: filterOutIndexes.name,
    tests: (runTest) => {
        const experimentArray = [
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
        ];

        runTest({
            description: 'removes array indexes',
            expect: [
                'a',
                'c',
                'd',
            ],
            test: () =>
                filterOutIndexes(
                    experimentArray,
                    [
                        1,
                        4,
                        5,
                        6,
                    ],
                ),
        });

        runTest({
            description: 'does not modify the original array',
            expect: [
                'a',
                'b',
                'c',
                'd',
                'e',
                'f',
                'g',
            ],
            test: () => {
                filterOutIndexes(
                    experimentArray,
                    [
                        1,
                        4,
                        5,
                        6,
                    ],
                );
                return experimentArray;
            },
        });

        runTest({
            description: "doesn't do anything if no indexes are given to remove",
            expect: experimentArray,
            test: () => filterOutIndexes(experimentArray, []),
        });
    },
});

testGroup({
    description: trimArrayStrings.name,
    tests: (runTest) => {
        runTest({
            description: 'white space is removed',
            expect: [
                'who is this',
                'what do you want',
                'hello there',
            ],
            test: () => {
                return trimArrayStrings(
                    `
                    who is this
                    what do you want
                    hello there
                    
                    
                `.split('\n'),
                );
            },
        });
    },
});

testGroup({
    description: flatten2dArray.name,
    tests: (runTest) => {
        runTest({
            description: 'array ordering is preserved and collapsed',
            expect: [
                1,
                2,
                3,
                4,
                5,
                6,
                0,
                7,
                8,
                9,
                10,
                11,
                12,
                21,
                22,
                22,
                1,
                0,
                -1,
            ],
            test: () => {
                return flatten2dArray([
                    [
                        1,
                        2,
                        3,
                    ],
                    [
                        4,
                        5,
                        6,
                        0,
                    ],
                    [
                        7,
                        8,
                        9,
                    ],
                    [10],
                    [
                        11,
                        12,
                    ],
                    [
                        21,
                        22,
                        22,
                        1,
                        0,
                        -1,
                    ],
                ]);
            },
        });
    },
});
