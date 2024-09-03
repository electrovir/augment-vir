import {describe, itCases} from '@augment-vir/test';
import {findSubstringIndexes} from './substring-index.js';

describe(findSubstringIndexes.name, () => {
    itCases(findSubstringIndexes, [
        {
            it: 'should find all substring instances in a string',
            input: {
                searchIn: 'who would hocked your thought now?',
                searchFor: 'o',
                caseSensitive: false,
            },
            expect: [
                2,
                5,
                11,
                18,
                24,
                31,
            ],
        },
        {
            it: 'should return nothing if no instances were found',
            input: {
                searchIn: 'hello what have we here',
                searchFor: /super long not found thing/,
                caseSensitive: false,
            },
            expect: [],
        },
        {
            it: 'should find all regex instances in a string',
            input: {
                searchIn: 'who would hocked your thought now?',
                searchFor: /o/,
                caseSensitive: false,
            },
            expect: [
                2,
                5,
                11,
                18,
                24,
                31,
            ],
        },
        {
            it: 'should find all RegExp matches with a capture group',
            input: {
                searchIn: 'who would hocked your thought now?',
                searchFor: /(o)/,
                caseSensitive: false,
            },
            expect: [
                2,
                5,
                11,
                18,
                24,
                31,
            ],
        },
        {
            it: 'should handle substring at the beginning of the string correctly',
            input: {
                searchIn: 'a fan is here',
                searchFor: 'a',
                caseSensitive: false,
            },
            expect: [
                0,
                3,
            ],
        },
        {
            it: 'should handle the substring at the end of the string only',
            input: {
                searchIn: 'boiled eggs',
                searchFor: 's',
                caseSensitive: false,
            },
            expect: [10],
        },
        {
            it: 'should handle the substring at the end and beginning of the string',
            input: {
                searchIn: 'some eggs',
                searchFor: 's',
                caseSensitive: false,
            },
            expect: [
                0,
                8,
            ],
        },
        {
            it: 'should handle longer words',
            input: {
                searchIn: 'when you go to you to have a you because you like you',
                searchFor: 'you',
                caseSensitive: true,
            },
            expect: [
                5,
                15,
                29,
                41,
                50,
            ],
        },
        {
            it: 'should match multiple in a row',
            input: {
                searchIn: 'YouYouYouYouYouYou',
                searchFor: 'You',
                caseSensitive: false,
            },
            expect: [
                0,
                3,
                6,
                9,
                12,
                15,
            ],
        },
        {
            it: 'should not match case mismatch',
            input: {
                searchIn: 'You are not you but You',
                searchFor: 'You',
                caseSensitive: true,
            },
            expect: [
                0,
                20,
            ],
        },
        {
            it: 'should honor case insensitive set to true',
            input: {
                searchIn: 'You are not you but You',
                searchFor: 'You',
                caseSensitive: false,
            },
            expect: [
                0,
                12,
                20,
            ],
        },
        {
            it: 'includes correct lengths for simple strings',
            input: {
                searchIn: 'You are not you but You',
                searchFor: 'You',
                caseSensitive: false,
                includeLength: true,
            },
            expect: [
                {
                    index: 0,
                    length: 3,
                },
                {
                    index: 12,
                    length: 3,
                },
                {
                    index: 20,
                    length: 3,
                },
            ],
        },
        {
            it: 'includes correct lengths for variable RegExp matches',
            input: {
                searchIn: 'YoAaAaAaAu are not yoAu but You',
                searchFor: /Yo.*?u/i,
                caseSensitive: false,
                includeLength: true,
            },
            expect: [
                {
                    index: 0,
                    length: 10,
                },
                {
                    index: 19,
                    length: 4,
                },
                {
                    index: 28,
                    length: 3,
                },
            ],
        },
        {
            it: 'includes correct lengths for more RegExp matches',
            input: {
                searchIn: 'hello YoAaAaAu do you have some time for yoZzZu?',
                searchFor: /yo.*?u/i,
                caseSensitive: false,
                includeLength: true,
            },
            expect: [
                {
                    index: 6,
                    length: 8,
                },
                {
                    index: 18,
                    length: 3,
                },
                {
                    index: 41,
                    length: 6,
                },
            ],
        },
    ]);
});
