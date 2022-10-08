import {expect} from 'chai';
import {describe, it} from 'mocha';
import {
    camelCaseToKebabCase,
    collapseWhiteSpace,
    escapeStringForRegExp,
    getAllIndexesOf,
    joinWithFinalConjunction,
    kebabCaseToCamelCase,
    randomString,
    removeAnsiEscapeCodes,
    removeColor,
    removeCommasFromNumberString,
    replaceStringAtIndex,
    splitIncludeSplit,
} from './string';

describe(joinWithFinalConjunction.name, () => {
    const tests: {input: unknown[]; expect: string}[] = [
        {input: [], expect: ''},
        {
            input: [
                'a',
                'b',
                'c',
            ],
            expect: 'a, b, and c',
        },
        {
            input: [
                1,
                2,
                3,
                4,
                5,
            ],
            expect: '1, 2, 3, 4, and 5',
        },
        {
            input: [
                {},
                {},
                {},
                {},
                {},
            ],
            expect: '[object Object], [object Object], [object Object], [object Object], and [object Object]',
        },
    ];
    it('should produce all correct outputs', () => {});
    tests.forEach((testInput, index) => {
        expect(joinWithFinalConjunction(testInput.input)).to.equal(testInput.expect);
    });
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

describe(kebabCaseToCamelCase.name, () => {
    it('should transform kebab-case to camelCase', () => {
        expect(kebabCaseToCamelCase('hello-there-what-have-we-here')).to.equal(
            'helloThereWhatHaveWeHere',
        );
        expect(
            kebabCaseToCamelCase('hello-there-what-have-we-here', {capitalizeFirstLetter: true}),
        ).to.equal('HelloThereWhatHaveWeHere');
    });

    it('should handle edge cases', () => {
        expect(kebabCaseToCamelCase('hello-THERE-what-have-we-here')).to.equal(
            'helloThereWhatHaveWeHere',
        );
        expect(kebabCaseToCamelCase('-hello-THERE-what-have-we-here-')).to.equal(
            'helloThereWhatHaveWeHere',
        );
        expect(kebabCaseToCamelCase('-hello----THERE-what-have-we-here-')).to.equal(
            'helloThereWhatHaveWeHere',
        );
        expect(kebabCaseToCamelCase('-hello----THERE-what-HAVE---we-here-----')).to.equal(
            'helloThereWhatHaveWeHere',
        );
        // cspell: disable
        expect(kebabCaseToCamelCase('HELLOTHEREWHATHAVEWEHERE')).to.equal(
            'hellotherewhathavewehere',
        );
        // cspell: enable
        expect(
            kebabCaseToCamelCase('----hello-there---what-have-we-here--', {
                capitalizeFirstLetter: true,
            }),
        ).to.equal('HelloThereWhatHaveWeHere');
    });
});

describe(camelCaseToKebabCase.name, () => {
    it('should transform camelCase to kebab-case', () => {
        expect(camelCaseToKebabCase('MyVarItHasManyWordsInIt')).to.equal(
            'my-var-it-has-many-words-in-it',
        );
        expect(camelCaseToKebabCase('myVarItHasManyWordsInIt')).to.equal(
            'my-var-it-has-many-words-in-it',
        );
    });
    it('should handle edge cases', () => {
        expect(camelCaseToKebabCase('MyVar--It-HasMany--WordsInIt')).to.equal(
            'my-var---it--has-many---words-in-it',
        );
        expect(camelCaseToKebabCase('MyCSSVar')).to.equal('my-css-var');
        expect(camelCaseToKebabCase('whatIsGoingOnHERE')).to.equal('what-is-going-on-here');
        expect(camelCaseToKebabCase('whatIfIHaveAnI')).to.equal('what-if-i-have-an-i');
    });
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

describe(randomString.name, () => {
    it('should not work in node (use the node version from node-only instead)', () => {
        expect(randomString).to.throw(
            "Window not defined for randomString function. If using this in a Node.js context, import randomString from 'augment-vir/dist/node'",
        );
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
    it('should find all substring instances in a string', () => {
        expect(getAllIndexesOf('who would hocked your thought now?', 'o', false)).to.deep.equal([
            2,
            5,
            11,
            18,
            24,
            31,
        ]);
    });

    it('should find all regex instances in a string', () => {
        expect(getAllIndexesOf('who would hocked your thought now?', /o/, false)).to.deep.equal([
            2,
            5,
            11,
            18,
            24,
            31,
        ]);
    });

    it('should find all RegExp matches with a capture group', () => {
        expect(getAllIndexesOf('who would hocked your thought now?', /(o)/, false)).to.deep.equal([
            2,
            5,
            11,
            18,
            24,
            31,
        ]);
    });

    it('should handle substring at the beginning of the string correctly', () => {
        expect(getAllIndexesOf('a fan is here', 'a', false)).to.deep.equal([
            0,
            3,
        ]);
    });

    it('should handle the substring at the end of the string only', () => {
        expect(getAllIndexesOf('boiled eggs', 's', false)).to.deep.equal([10]);
    });

    it('should handle the substring at the end and beginning of the string', () => {
        expect(getAllIndexesOf('some eggs', 's', false)).to.deep.equal([
            0,
            8,
        ]);
    });

    it('should handle longer words', () => {
        expect(
            getAllIndexesOf('when you go to you to have a you because you like you', 'you', true),
        ).to.deep.equal([
            5,
            15,
            29,
            41,
            50,
        ]);
    });

    it('should match multiple in a row', () => {
        expect(getAllIndexesOf('YouYouYouYouYouYou', 'You', false)).to.deep.equal([
            0,
            3,
            6,
            9,
            12,
            15,
        ]);
    });

    it('should not match case mismatch', () => {
        expect(getAllIndexesOf('You are not you but You', 'You', true)).to.deep.equal([
            0,
            20,
        ]);
    });

    it('should honor case insensitive set to true', () => {
        expect(getAllIndexesOf('You are not you but You', 'You', false)).to.deep.equal([
            0,
            12,
            20,
        ]);
    });

    it('includes correct lengths for simple strings', () => {
        expect(getAllIndexesOf('You are not you but You', 'You', false, true)).to.deep.equal([
            {index: 0, length: 3},
            {index: 12, length: 3},
            {index: 20, length: 3},
        ]);
    });

    it('includes correct lengths for variable RegExp matches', () => {
        expect(
            getAllIndexesOf('YoAaAaAaAu are not yoAu but You', /Yo.*?u/i, false, true),
        ).to.deep.equal([
            {index: 0, length: 10},
            {index: 19, length: 4},
            {index: 28, length: 3},
        ]);
    });

    it('includes correct lengths for more RegExp matches', () => {
        expect(
            getAllIndexesOf(
                'hello YoAaAaAu do you have some time for yoZzZu?',
                /yo.*?u/i,
                false,
                true,
            ),
        ).to.deep.equal([
            {index: 6, length: 8},
            {index: 18, length: 3},
            {index: 41, length: 6},
        ]);
    });
});
