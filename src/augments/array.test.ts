import {filterOutIndexes, flatten2dArray, trimArrayStrings} from './array';

describe(filterOutIndexes.name, () => {
    const experimentArray = [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
    ];

    it('removes array indexes', () => {
        expect(
            filterOutIndexes(
                experimentArray,
                [
                    1,
                    4,
                    5,
                    6,
                ],
            ),
        ).toEqual([
            'a',
            'c',
            'd',
        ]);
    });

    it('does not modify the original array', () => {
        filterOutIndexes(
            experimentArray,
            [
                1,
                4,
                5,
                6,
            ],
        );
        expect(experimentArray).toEqual([
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
        ]);
    });

    it("doesn't do anything if no indexes are given to remove", () => {
        expect(filterOutIndexes(experimentArray, [])).toEqual(experimentArray);
    });
});

describe(trimArrayStrings.name, () => {
    it('white space is removed', () => {
        expect(
            trimArrayStrings(
                `
                    who is this
                    what do you want
                    hello there
                    
                    
                `.split('\n'),
            ),
        ).toEqual([
            'who is this',
            'what do you want',
            'hello there',
        ]);
    });
});

describe(flatten2dArray.name, () => {
    it('array ordering is preserved and collapsed', () => {
        expect(
            flatten2dArray([
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
            ]),
        ).toEqual([
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
        ]);
    });
});
