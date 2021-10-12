import {testGroup} from 'test-vir';
import {filterOutIndexes} from './array';

testGroup({
    description: filterOutIndexes.name,
    tests: (runTest) => {
        const experimentArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

        runTest({
            description: 'removes array indexes',
            expect: ['a', 'c', 'd'],
            test: () => filterOutIndexes(experimentArray, [1, 4, 5, 6]),
        });

        runTest({
            description: 'does not modify the original array',
            expect: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
            test: () => {
                filterOutIndexes(experimentArray, [1, 4, 5, 6]);
                return experimentArray;
            },
        });

        runTest({
            description: "doesn't do anything if no indexes are given to remove",
            expect: experimentArray,
            test: () => filterOutIndexes(experimentArray, []),
        });
    },
});
