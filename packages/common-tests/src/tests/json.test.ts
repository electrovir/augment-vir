import {itCases} from '@augment-vir/chai';
import {parseJson, stringifyJson} from '@augment-vir/common';
import {describe} from 'mocha';

describe(parseJson.name, () => {
    itCases(parseJson, [
        {
            it: 'parses its string input',
            input: {jsonString: '5'},
            expect: 5,
        },
        {
            it: 'parses an object string input',
            input: {jsonString: '{"hi":"bye"}'},
            expect: {hi: 'bye'},
        },
        {
            it: 'does not run the error handler when there is no error',
            input: {
                jsonString: '"just a string"',
                errorHandler: () => {
                    throw new Error('this error will not happen');
                },
            },
            expect: 'just a string',
        },
        {
            it: 'runs the error handler on error',
            input: {
                jsonString: '[----[];lf',
                errorHandler: () => {
                    throw new Error('new error');
                },
            },
            throws: 'new error',
        },
        {
            it: 'passes valid output string assertion',
            input: {
                jsonString: '"should pass"',
                shapeMatcher: '',
                errorHandler: () => {
                    throw new Error('new error');
                },
            },
            expect: 'should pass',
        },
        {
            it: 'fails invalid output string assertion',
            input: {
                jsonString: '456',
                shapeMatcher: '',
                errorHandler: () => {
                    throw new Error('that was not a string');
                },
            },
            throws: 'that was not a string',
        },
        {
            it: 'passes valid output object assertion',
            input: {
                jsonString: '{"numberKey": -1, "stringKey": "some string"}',
                shapeMatcher: {numberKey: 52, stringKey: ''},
            },
            expect: {numberKey: -1, stringKey: 'some string'},
        },
        {
            it: 'fails invalid output object assertion',
            input: {
                jsonString: '{"numberKey": -1, "stringKey": "some string"}',
                shapeMatcher: {numberKey: 52, stringKey: '', thisKeyIsMissing: ''},
            },
            throws: Error,
        },
    ]);
});

describe(stringifyJson.name, () => {
    const recursiveObject = {
        nested: '' as any,
    };
    recursiveObject.nested = recursiveObject;

    itCases(stringifyJson, [
        {
            it: 'handles a basic object',
            inputs: [
                {thing: 'a'},
                {},
            ],
            expect: '{"thing":"a"}',
        },
        {
            it: 'inserts whitespace',
            inputs: [
                {thing: 'a'},
                {whitespace: 4},
            ],
            expect: '{\n    "thing": "a"\n}',
        },
        {
            it: 'handles a stringify failure with the errorHandler',
            inputs: [
                recursiveObject,
                {
                    handleError() {
                        return 'failure';
                    },
                },
            ],
            expect: 'failure',
        },
        {
            it: 'handles a stringify failure with the fallback value',
            inputs: [
                recursiveObject,
                {
                    fallbackValue: 'fallback',
                },
            ],
            expect: 'fallback',
        },
        {
            it: 'throws an error on stringify failure without an errorHandler',
            inputs: [
                recursiveObject,
                {},
            ],
            throws: Error,
        },
    ]);
});
