import {describe, itCases} from '@augment-vir/test';
import {StringCase} from './casing.js';
import {camelCaseToKebabCase, kebabCaseToCamelCase} from './kebab-and-camel.js';

describe(kebabCaseToCamelCase.name, () => {
    itCases(kebabCaseToCamelCase, [
        {
            it: 'works on long string',
            inputs: ['hello-there-what-have-we-here'],
            expect: 'helloThereWhatHaveWeHere',
        },
        {
            it: 'works on long string with undefined options',
            inputs: [
                'hello-there-what-have-we-here',
                undefined,
            ],
            expect: 'helloThereWhatHaveWeHere',
        },
        {
            it: 'works on long string with empty options',
            inputs: [
                'hello-there-what-have-we-here',
                {},
            ],
            expect: 'helloThereWhatHaveWeHere',
        },
        {
            it: 'works on long string with capital first letter',
            inputs: [
                'hello-there-what-have-we-here',
                {
                    firstLetterCase: StringCase.Upper,
                },
            ],
            expect: 'HelloThereWhatHaveWeHere',
        },
        {
            it: 'works with uppercase word',
            inputs: ['hello-THERE-what-have-we-here'],
            expect: 'helloThereWhatHaveWeHere',
        },
        {
            it: 'works with uppercase word and leading dash',
            inputs: ['-hello-THERE-what-have-we-here-'],
            expect: 'helloThereWhatHaveWeHere',
        },
        {
            it: 'returns empty string for empty input',
            inputs: [''],
            expect: '',
        },
        {
            it: 'works with uppercase word and leading dash and lots of dashes',
            inputs: ['-hello----THERE-what-have-we-here-'],
            expect: 'helloThereWhatHaveWeHere',
        },
        {
            it: 'works with lots of dashes',
            inputs: ['-hello----THERE-what-HAVE---we-here-----'],
            expect: 'helloThereWhatHaveWeHere',
        },
        {
            it: 'works with lots of dashes and capital first letter',
            inputs: [
                '----hello-there---what-have-we-here--',
                {
                    firstLetterCase: StringCase.Upper,
                },
            ],
            expect: 'HelloThereWhatHaveWeHere',
        },
        {
            it: 'works on all uppercaseString',
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
            it: 'works with simple capitalized case',
            input: 'MyVarItHasManyWordsInIt',
            expect: 'my-var-it-has-many-words-in-it',
        },
        {
            it: 'works with simple case',
            input: 'myVarItHasManyWordsInIt',
            expect: 'my-var-it-has-many-words-in-it',
        },
        {
            it: 'persists dashes',
            input: 'MyVar--It-HasMany--WordsInIt',
            expect: 'my-var---it--has-many---words-in-it',
        },
        {
            it: 'handles consecutive uppercase letters',
            input: 'MyCSSVar',
            expect: 'my-css-var',
        },
        {
            it: 'handles capitalized words',
            input: 'whatIsGoingOnHERE',
            expect: 'what-is-going-on-here',
        },
        {
            it: 'handles uppercase single letters',
            input: 'whatIfIHaveAnI',
            expect: 'what-if-i-have-an-i',
        },
    ]);
});
