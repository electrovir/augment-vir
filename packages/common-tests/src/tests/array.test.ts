import {itCases} from '@augment-vir/chai';
import {assertTypeOf} from '@augment-vir/testing';
import {expect} from 'chai';
import {describe, it} from 'mocha';
import {
    filterOutIndexes,
    flatten2dArray,
    trimArrayStrings,
    typedArrayIncludes,
} from '../../../common/src';

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
        ).to.deep.equal([
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
        expect(experimentArray).to.deep.equal([
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
        expect(filterOutIndexes(experimentArray, [])).to.deep.equal(experimentArray);
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
        ).to.deep.equal([
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
        ).to.deep.equal([
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

describe(typedArrayIncludes.name, () => {
    itCases(typedArrayIncludes, [
        {
            it: 'should work for string array',
            expect: true,
            inputs: [
                [
                    'hello',
                    'there',
                ],
                'there',
            ],
        },
    ]);

    it('should be a general type guard', () => {
        const array = [
            'yo',
            'hello',
            'hi',
        ];

        const vagueVar: number | string = 'yo' as number | string;

        if (typedArrayIncludes(array, vagueVar)) {
            const definitelyString: string = vagueVar;
        }
    });

    it('should be a super narrow type guard', () => {
        const array = [
            'yo',
            'hello',
            'hi',
        ] as const;

        const vagueVar: number | string = 'yo' as number | string;

        if (typedArrayIncludes(array, vagueVar)) {
            assertTypeOf(vagueVar).toEqualTypeOf<'yo' | 'hello' | 'hi'>();
        }
    });
});
