import {testGroup} from 'test-vir';
import {randomString} from './node-string';

testGroup({
    description: randomString.name,
    tests: (runTest) => {
        runTest({
            description: 'random string length is not required (has a default)',
            test: () => {
                randomString();
            },
        });

        const length = 24;

        runTest({
            expect: length,
            description: 'random string length matches specified length',
            test: () => {
                return randomString(length).length;
            },
        });

        runTest({
            expect: false,
            description: 'multiple calls to random string are not identical',
            test: () => {
                return randomString() === randomString();
            },
        });

        runTest({
            expect: 3,
            description: 'length works with odd numbers',
            test: () => {
                return randomString(3).length;
            },
        });
    },
});
