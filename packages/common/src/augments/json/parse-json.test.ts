import {describe, itCases} from '@augment-vir/test';
import {parseJson} from './parse-json.js';

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
            throws: {
                matchMessage: 'new error',
            },
        },
    ]);
});
