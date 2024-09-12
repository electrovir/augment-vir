import {describe, itCases} from '@augment-vir/test';
import {camelCaseToKebabCase, kebabCaseToCamelCase} from './kebab-and-camel.js';

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
