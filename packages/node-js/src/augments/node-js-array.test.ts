import {assert} from 'chai';
import {shuffleArray} from './node-js-array';
import {randomInteger} from './node-js-random';

describe(shuffleArray.name, () => {
    const exampleArray: ReadonlyArray<number> = Array(100)
        .fill(0)
        .map(() => randomInteger({min: 0, max: 999}));

    it('shuffles an array', () => {
        try {
            assert.notDeepEqual(shuffleArray(exampleArray), exampleArray);
        } catch (error) {
            // in the off chance that the shuffle actually produces the same array order, try it again.
            assert.notDeepEqual(shuffleArray(exampleArray), exampleArray);
        }
    });

    it('does not change the originalArray', () => {
        const originalExampleArrayReference = exampleArray;
        const originalExampleArrayEntries = [...exampleArray];
        // two times just
        const shuffledArray = shuffleArray(exampleArray);
        assert.notDeepEqual(shuffledArray, exampleArray);

        assert.strictEqual(exampleArray, originalExampleArrayReference);
        assert.deepStrictEqual(exampleArray, originalExampleArrayEntries);
    });
});
