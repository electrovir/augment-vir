import {assertTypeOf, itCases} from '@augment-vir/chai';
import {assert, expect} from 'chai';
import {describe, it} from 'mocha';
import {
    camelCaseToKebabCase,
    capitalizeFirstLetter,
    collapseWhiteSpace,
    escapeStringForRegExp,
    getAllIndexesOf,
    joinWithFinalConjunction,
    kebabCaseToCamelCase,
    removeAnsiEscapeCodes,
    removeColor,
    removeCommasFromNumberString,
    replaceStringAtIndex,
    splitIncludeSplit,
    typedSplit,
} from '../../../common/src/augments/common-string';

describe(joinWithFinalConjunction.name, () => {
    itCases(joinWithFinalConjunction, [
        {
            it: 'should return empty string when given an empty array',
            inputs: [[]],
            expect: '',
        },
        {
            it: 'should not add a comma to only two items',
            inputs: [
                [
                    'a',
                    'b',
                ],
            ],
            expect: 'a and b',
        },
        {
            it: 'should join 3 strings',
            inputs: [
                [
                    'a',
                    'b',
                    'c',
                ],
            ],
            expect: 'a, b, and c',
        },
        {
            it: 'should join 5 strings',
            inputs: [
                [
                    1,
                    2,
                    3,
                    4,
                    5,
                ],
            ],
            expect: '1, 2, 3, 4, and 5',
        },
        {
            it: 'should use a custom conjunction',
            inputs: [
                [
                    1,
                    2,
                    3,
                    4,
                    5,
                ],
                'or',
            ],
            expect: '1, 2, 3, 4, or 5',
        },
        {
            it: 'should even join non-string inputs',
            inputs: [
                [
                    {},
                    {},
                    {},
                    {},
                    {},
                ],
            ],
            expect: '[object Object], [object Object], [object Object], [object Object], and [object Object]',
        },
    ]);
});

describe(collapseWhiteSpace.name, () => {
    it(`check simple space collapsing`, () => {
        expect(collapseWhiteSpace('hello           there')).to.equal('hello there');
    });

    it(`multiple space collapsing`, () => {
        expect(
            collapseWhiteSpace(
                'hello           there          you        are a bold           one',
            ),
        ).to.equal('hello there you are a bold one');
    });

    it(`beginning and ending space is trimmed as well`, () => {
        expect(collapseWhiteSpace('     hello   there     ')).to.equal('hello there');
    });

    it('should trim inner newlines', () => {
        expect(collapseWhiteSpace('hello\n\nthere')).to.equal('hello there');
        expect(collapseWhiteSpace('hello\n\nthere\n\nstuff')).to.equal('hello there stuff');
    });
});

describe(removeCommasFromNumberString.name, () => {
    it(`one comma stripped`, () => {
        expect(removeCommasFromNumberString('123,456')).to.equal('123456');
    });

    it(`multiple commas stripped`, () => {
        expect(removeCommasFromNumberString('123,456,789,012')).to.equal('123456789012');
    });

    it(`no commas stripped`, () => {
        expect(removeCommasFromNumberString('1234.56')).to.equal('1234.56');
    });

    it(`comma stripped with decimal intact`, () => {
        expect(removeCommasFromNumberString('1,234.56')).to.equal('1234.56');
    });
});

describe(capitalizeFirstLetter.name, () => {
    itCases(capitalizeFirstLetter<any>, [
        {
            it: 'should capitalize a normal word',
            input: 'derp',
            expect: 'Derp',
        },
        {
            it: 'should not modify a numeric first letter',
            input: '12345',
            expect: '12345',
        },
        {
            it: 'should return empty string if input is empty',
            input: '',
            expect: '',
        },
    ]);
});

describe(kebabCaseToCamelCase.name, () => {
    itCases(kebabCaseToCamelCase, [
        {
            it: 'should work on long string',
            inputs: ['hello-there-what-have-we-here'],
            expect: 'helloThereWhatHaveWeHere',
        },
        {
            it: 'should work on long string with undefined options',
            inputs: [
                'hello-there-what-have-we-here',
                undefined,
            ],
            expect: 'helloThereWhatHaveWeHere',
        },
        {
            it: 'should work on long string with empty options',
            inputs: [
                'hello-there-what-have-we-here',
                {},
            ],
            expect: 'helloThereWhatHaveWeHere',
        },
        {
            it: 'should work on long string with capital first letter',
            inputs: [
                'hello-there-what-have-we-here',
                {
                    capitalizeFirstLetter: true,
                },
            ],
            expect: 'HelloThereWhatHaveWeHere',
        },
        {
            it: 'should work with uppercase word',
            inputs: ['hello-THERE-what-have-we-here'],
            expect: 'helloThereWhatHaveWeHere',
        },
        {
            it: 'should work with uppercase word and leading dash',
            inputs: ['-hello-THERE-what-have-we-here-'],
            expect: 'helloThereWhatHaveWeHere',
        },
        {
            it: 'should return empty string for empty input',
            inputs: [''],
            expect: '',
        },
        {
            it: 'should work with uppercase word and leading dash and lots of dashes',
            inputs: ['-hello----THERE-what-have-we-here-'],
            expect: 'helloThereWhatHaveWeHere',
        },
        {
            it: 'should work with lots of dashes',
            inputs: ['-hello----THERE-what-HAVE---we-here-----'],
            expect: 'helloThereWhatHaveWeHere',
        },
        {
            it: 'should work with lots of dashes and capital first letter',
            inputs: [
                '----hello-there---what-have-we-here--',
                {
                    capitalizeFirstLetter: true,
                },
            ],
            expect: 'HelloThereWhatHaveWeHere',
        },
        {
            it: 'should work on all uppercaseString',
            // cspell: disable
            inputs: ['HELLOTHEREWHATHAVEWEHERE'],
            expect: 'hellotherewhathavewehere',
            // cspell: enable
        },
    ]);
});

describe(camelCaseToKebabCase.name, () => {
    itCases(camelCaseToKebabCase, [
        {
            it: 'should work with simple capitalized case',
            input: 'MyVarItHasManyWordsInIt',
            expect: 'my-var-it-has-many-words-in-it',
        },
        {
            it: 'should work with simple case',
            input: 'myVarItHasManyWordsInIt',
            expect: 'my-var-it-has-many-words-in-it',
        },
        {
            it: 'should persist dashes',
            input: 'MyVar--It-HasMany--WordsInIt',
            expect: 'my-var---it--has-many---words-in-it',
        },
        {
            it: 'should handle consecutive uppercase letters',
            input: 'MyCSSVar',
            expect: 'my-css-var',
        },
        {
            it: 'should handle capitalized words',
            input: 'whatIsGoingOnHERE',
            expect: 'what-is-going-on-here',
        },
        {
            it: 'should handle uppercase single letters',
            input: 'whatIfIHaveAnI',
            expect: 'what-if-i-have-an-i',
        },
    ]);
});

describe(replaceStringAtIndex.name, () => {
    it('should insert a string at the desire index without edge cases', () => {
        expect(replaceStringAtIndex('eat the waffles', 4, 'his')).to.equal('eat his waffles');
    });

    it('should insert the string at the beginning', () => {
        expect(replaceStringAtIndex('eat the waffles', 0, 'cut')).to.equal('cut the waffles');
    });

    it('should replace the string at the end', () => {
        const originalString = 'race the race';
        expect(replaceStringAtIndex(originalString, originalString.length - 1, 'y car!')).to.equal(
            'race the racy car!',
        );
    });

    it('should replace longer text with shorter text', () => {
        expect(replaceStringAtIndex('eat the waffles', 4, 'my', 3)).to.equal('eat my waffles');
    });

    it('should insert text is length is 0', () => {
        expect(replaceStringAtIndex('eat the waffles', 8, 'blueberry ', 0)).to.equal(
            'eat the blueberry waffles',
        );
    });

    it('should work with length when start index is 0 and replacement is shorter', () => {
        expect(replaceStringAtIndex(' a b c', 0, ' of', 6)).to.equal(' of');
    });

    it('should work with length when start index is 0 and replacement is longer', () => {
        expect(replaceStringAtIndex(' a b c', 0, ' super duper thing', 6)).to.equal(
            ' super duper thing',
        );
    });
});

const identicalRemoveAnsiCodeFunctions = [
    removeAnsiEscapeCodes,
    removeColor,
];
identicalRemoveAnsiCodeFunctions.forEach((identicalFunction) => {
    describe(identicalFunction.name, () => {
        it('should remove all ansi escape codes', () => {
            expect(identicalFunction('hello\x1b[1m there\x1b[0m')).to.equal('hello there');
        });

        it('should not remove anything when there are no escape codes', () => {
            expect(identicalFunction('hello there')).to.equal('hello there');
        });
    });
});

describe(escapeStringForRegExp.name, () => {
    it('should escape regexp characters', () => {
        expect(escapeStringForRegExp('[*.*]')).to.equal('\\[\\*\\.\\*\\]');
    });

    it('escaped text works as a RegExp', () => {
        const result = Array.from('[*.*]'.match(new RegExp(escapeStringForRegExp('[*.*]'))) || []);
        const expected = ['[*.*]'];
        expect(result).to.deep.equal(expected);
    });
});

describe(splitIncludeSplit.name, () => {
    it('splits by variable length RegExp matches', () => {
        expect(
            splitIncludeSplit('hello YoAaAaAu do you have some time for yoZzZu?', /yo.*?u/i, false),
        ).to.deep.equal([
            'hello ',
            'YoAaAaAu',
            ' do ',
            'you',
            ' have some time for ',
            'yoZzZu',
            '?',
        ]);
    });

    it('splits by a simple string', () => {
        expect(
            splitIncludeSplit('hello You do you have some time for you?', 'you', false),
        ).to.deep.equal([
            'hello ',
            'You',
            ' do ',
            'you',
            ' have some time for ',
            'you',
            '?',
        ]);
    });
});

describe(getAllIndexesOf.name, () => {
    itCases(getAllIndexesOf, [
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

describe(typedSplit.name, () => {
    it('should still split like normal', () => {
        assert.deepStrictEqual(typedSplit('1.2', '.'), [
            '1',
            '2',
        ]);
    });
    it('should have the correct types', () => {
        const [
            first,
            second,
        ] = typedSplit('1.2', '.');
        assertTypeOf(first).toEqualTypeOf<string>();
        assertTypeOf(second).toEqualTypeOf<string | undefined>();
    });
});
