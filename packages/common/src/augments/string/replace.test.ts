import {describe} from '@augment-vir/test';
import {replaceStringAtIndex} from './replace.js';

describe(replaceStringAtIndex.name, ({itCases, it}) => {
    const exampleString = 'race the race';

    itCases(replaceStringAtIndex, [
        {
            it: 'should insert a string at the desire index without edge cases',
            inputs: [
                'eat the waffles',
                4,
                'his',
            ],
            expect: 'eat his waffles',
        },
        {
            it: 'should insert the string at the beginning',
            inputs: [
                'eat the waffles',
                0,
                'cut',
            ],
            expect: 'cut the waffles',
        },
        {
            it: 'should replace the string at the end',
            inputs: [
                exampleString,
                exampleString.length - 1,
                'y car!',
            ],
            expect: 'race the racy car!',
        },
        {
            it: 'should replace longer text with shorter text',
            inputs: [
                'eat the waffles',
                4,
                'my',
                3,
            ],
            expect: 'eat my waffles',
        },
        {
            it: 'should insert text is length is 0',
            inputs: [
                'eat the waffles',
                8,
                'blueberry ',
                0,
            ],
            expect: 'eat the blueberry waffles',
        },
        {
            it: 'should work with length when start index is 0 and replacement is shorter',
            inputs: [
                ' a b c',
                0,
                ' of',
                6,
            ],
            expect: ' of',
        },
        {
            it: 'should work with length when start index is 0 and replacement is longer',
            inputs: [
                ' a b c',
                0,
                ' super duper thing',
                6,
            ],
            expect: ' super duper thing',
        },
    ]);
});
