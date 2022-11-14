import {expectDuration} from '@augment-vir/chai';
import {
    awaitedBlockingMap,
    awaitedForEach,
    filterOutIndexes,
    flatten2dArray,
    isInTypedArray,
    trimArrayStrings,
    wait,
} from '@augment-vir/common';
import {randomString} from '@augment-vir/node-js';
import {expect} from 'chai';
import {describe, it} from 'mocha';

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

describe(awaitedForEach.name, () => {
    it('should ensure execution order', async () => {
        const originalArray: string[] = Array(5)
            .fill(0)
            .map(() => randomString());
        const results: string[] = [];
        let totalWait = 0;
        (
            await expectDuration(async () => {
                await awaitedForEach(originalArray, async (element, index) => {
                    if (index === 1) {
                        await wait(1000);
                        totalWait += 1000;
                    } else {
                        await wait(50);
                        totalWait += 50;
                    }
                    results.push(element);
                });

                // ensure the order is the same despite a long wait time in the middle
            })
        ).to.be.greaterThanOrEqual(totalWait);
        expect(results).to.deep.equal(originalArray);
    });
});

describe(awaitedBlockingMap.name, () => {
    it('should return values and maintain execution order', async () => {
        const originalArray: string[] = Array(5)
            .fill(0)
            .map(() => randomString());
        let totalWait = 0;
        (
            await expectDuration(async () => {
                const results = await awaitedBlockingMap(originalArray, async (element, index) => {
                    if (index === 1) {
                        await wait(1000);
                        totalWait += 1000;
                    } else {
                        await wait(50);
                        totalWait += 50;
                    }
                    return {element};
                });

                // ensure the order is the same despite a long wait time in the middle
                expect(results.map((wrapper) => wrapper.element)).to.deep.equal(originalArray);
            })
        ).to.be.greaterThanOrEqual(totalWait);
    });
});

describe(isInTypedArray.name, () => {
    it('should match test cases', () => {
        const testCases = [];
    });
});
