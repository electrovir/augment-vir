import {describe, itCases} from '@augment-vir/test';
import {replaceStringAtIndex} from './replace.js';

describe(replaceStringAtIndex.name, () => {
    const exampleString = 'race the race';

    itCases(replaceStringAtIndex, [
        {
            it: 'inserts a string at the desire index without edge cases',
            input: {
                original: 'eat the waffles',
                start: 4,
                replacement: 'his',
            },
            expect: 'eat his waffles',
        },
        {
            it: 'inserts the string at the beginning',
            input: {
                original: 'eat the waffles',
                start: 0,
                replacement: 'cut',
            },
            expect: 'cut the waffles',
        },
        {
            it: 'replaces the string at the end',
            input: {
                original: exampleString,
                start: exampleString.length - 1,
                replacement: 'y car!',
            },
            expect: 'race the racy car!',
        },
        {
            it: 'replaces longer text with shorter text',
            input: {
                original: 'eat the waffles',
                start: 4,
                replacement: 'my',
                length: 3,
            },
            expect: 'eat my waffles',
        },
        {
            it: 'inserts text if length is 0',
            input: {
                original: 'eat the waffles',
                start: 8,
                replacement: 'blueberry ',
                length: 0,
            },
            expect: 'eat the blueberry waffles',
        },
        {
            it: 'works with length when start index is 0 and replacement is shorter',
            input: {
                original: ' a b c',
                start: 0,
                replacement: ' of',
                length: 6,
            },
            expect: ' of',
        },
        {
            it: 'works with length when start index is 0 and replacement is longer',
            input: {
                original: ' a b c',
                start: 0,
                replacement: ' super duper thing',
                length: 6,
            },
            expect: ' super duper thing',
        },
    ]);
});
