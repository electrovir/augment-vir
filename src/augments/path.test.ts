import {sep} from 'path';
import {testGroup} from 'test-vir';
import {getRepoRootDir} from './path';

testGroup({
    description: getRepoRootDir.name,
    tests: (runTest) => {
        runTest({
            description: 'basic test ends with repo name',
            expect: 'augment-vir',
            test: () => {
                const splitPath = getRepoRootDir()
                    .split(sep)
                    // remove empty dirs from splitting around beginning or ending "/"
                    .filter((dir) => !!dir);
                return splitPath[splitPath.length - 1];
            },
        });
    },
});
