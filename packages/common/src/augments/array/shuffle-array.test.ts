import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {randomInteger} from '../random/random-integer.js';
import {shuffleArray} from './shuffle-array.js';

describe(shuffleArray.name, () => {
    const exampleArray: ReadonlyArray<number> = new Array(100)
        .fill(0)
        .map(() => randomInteger({min: 0, max: 999}));

    it('shuffles an array', () => {
        try {
            assert.notDeepEquals(shuffleArray(exampleArray), exampleArray);
        } catch {
            // in the off chance that the shuffle actually produces the same array order, try it again.
            assert.notDeepEquals(shuffleArray(exampleArray), exampleArray);
        }
    });

    it('does not change the originalArray', () => {
        const originalExampleArrayReference = exampleArray;
        const originalExampleArrayEntries = [...exampleArray];
        // two times just
        const shuffledArray = shuffleArray(exampleArray);
        assert.notDeepEquals(shuffledArray, exampleArray);

        assert.strictEquals(exampleArray, originalExampleArrayReference);
        assert.deepEquals(exampleArray, originalExampleArrayEntries);
    });
});
