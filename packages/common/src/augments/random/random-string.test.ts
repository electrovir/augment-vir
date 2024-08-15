import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {allowedRandomStringLetters, randomString} from './random-string.js';

describe(randomString.name, () => {
    it('produces unique strings', () => {
        const randomStrings = new Array(100).fill(0).map(() => {
            return randomString();
        });
        const randomStringSet = new Set(randomStrings);

        assert.strictEquals(
            randomStringSet.size,
            randomStrings.length,
            'some "random" strings were removed when converting to a set, meaning there were duplicates.',
        );
    });

    it('uses the given length parameter', () => {
        assert.isLengthAtLeast(randomString(4), 4);
    });

    it('does not favor any one letter', () => {
        const letters: Record<string, number> = {};
        const iterationCount = 1_000_000;
        /**
         * If this is ⪆20, or `iterationCount` is too high, the `crypto.getRandomValues` call in
         * `randomInteger` fails with "Map maximum size exceeded", even though the needed bytes is
         * always just 1. Maybe the Uin8Array instances aren't getting garbage collected?
         */
        const stringLength = 10;

        try {
            for (let i = 0; i < iterationCount; i++) {
                const result = randomString(stringLength);

                for (const letter of result) {
                    letters[letter] = (letters[letter] || 0) + 1;
                }
            }
        } catch (error) {
            /** In practice, this doesn't actually help with catching the memory crash errors. */
            console.error(letters);
            throw error;
        }

        const letterEntries = Object.entries(letters);

        assert.isLengthExactly(letterEntries, allowedRandomStringLetters.length);

        const expectedAmount = (iterationCount * stringLength) / allowedRandomStringLetters.length;

        try {
            letterEntries.forEach(
                ([
                    ,
                    letterCount,
                ]) => {
                    assert.isApproximately(letterCount, expectedAmount, expectedAmount * 0.008);
                },
            );
        } catch (error) {
            console.error(letters);
            throw error;
        }
    });
});
