import {testGroup} from 'test-vir';
import {isTruthy} from './function';

testGroup({
    description: isTruthy.name,
    tests: (runTest) => {
        runTest({
            description: 'should return true for various truthy things',
            expect: true,
            test: () => {
                const stuffToTest: any[] = [
                    'stuff',
                    5,
                    [],
                    {},
                ];

                return stuffToTest.every(isTruthy);
            },
        });

        runTest({
            description: 'should filter out null types',
            expect: [
                'stuff',
                'derp',
            ],
            test: () => {
                const stuffToTest: (string | undefined)[] = [
                    'stuff',
                    undefined,
                    'derp',
                ];

                const onlyStrings: string[] = stuffToTest.filter(isTruthy);

                return onlyStrings;
            },
        });

        runTest({
            description: 'should fail on falsy things',
            expect: false,
            test: () => {
                const stuffToTest: any[] = [
                    undefined,
                    false,
                    0,
                    '',
                    null,
                    NaN,
                ];

                return stuffToTest.some(isTruthy);
            },
        });
    },
});
