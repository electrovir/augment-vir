import {describe} from '@augment-vir/test';
import {stringifyJson} from './stringify-json.js';

describe(stringifyJson.name, ({itCases}) => {
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
            throws: {
                matchConstructor: Error,
            },
        },
        {
            it: 'can throw from the error handler',
            inputs: [
                recursiveObject,
                {
                    handleError() {
                        throw new Error('better error');
                    },
                },
            ],
            throws: {
                matchMessage: 'better error',
            },
        },
    ]);
});
