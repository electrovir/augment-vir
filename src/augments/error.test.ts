import {testGroup} from 'test-vir';
import {extractErrorMessage} from './error';

testGroup({
    description: extractErrorMessage.name,
    tests: (runTest) => {
        runTest({
            description: 'should extract message from error object',
            expect: 'hello there',
            test: () => extractErrorMessage(new Error('hello there')),
        });

        runTest({
            description: 'should return empty string for falsy inputs',
            expect: '',
            test: () =>
                extractErrorMessage(undefined) +
                extractErrorMessage(null) +
                extractErrorMessage(false),
        });

        runTest({
            description: 'should return a string for other inputs',
            expect: '54621',
            test: () => extractErrorMessage(54621),
        });

        runTest({
            description: 'should return a string for strings',
            expect: 'just a string',
            test: () => extractErrorMessage('just a string'),
        });
    },
});
