import {testGroup} from 'test-vir';
import {joinWithFinalConjunction} from './string';

testGroup({
    description: joinWithFinalConjunction.name,
    tests: (runTest) => {
        const tests: {input: unknown[]; expect: string}[] = [
            {input: [], expect: ''},
            {input: ['a', 'b', 'c'], expect: 'a, b, and c'},
            {input: [1, 2, 3, 4, 5], expect: '1, 2, 3, 4, and 5'},
            {
                input: [{}, {}, {}, {}, {}],
                expect: '[object Object], [object Object], [object Object], [object Object], and [object Object]',
            },
        ];

        tests.forEach((testInput, index) =>
            runTest({
                description: `test ${index}`,
                expect: testInput.expect,
                test: () => joinWithFinalConjunction(testInput.input),
            }),
        );
    },
});
