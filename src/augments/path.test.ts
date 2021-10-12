import {sep} from 'path';
import {testGroup} from 'test-vir';
import {getRepoRootDir, interpolationSafeWindowsPath, toPosixPath} from './path';

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

testGroup({
    description: interpolationSafeWindowsPath.name,
    tests: (runTest) => {
        runTest({
            description: 'with drive letter',
            expect: 'D:\\\\\\\\a\\\\\\\\virmator\\\\\\\\virmator\\\\\\\\dist\n',
            test: () => {
                return interpolationSafeWindowsPath('D:\\a\\virmator\\virmator\\dist\n');
            },
        });
    },
});

testGroup({
    description: toPosixPath.name,
    tests: (runTest) => {
        runTest({
            description: 'with drive letter',
            expect: '/d/a/virmator/virmator/dist\n',
            test: () => {
                return toPosixPath('D:\\a\\virmator\\virmator\\dist\n');
            },
        });

        runTest({
            description: 'with double escaped path',
            expect: '/d/a/virmator/virmator/dist\n',
            test: () => {
                return toPosixPath('D:\\\\a\\\\virmator\\\\virmator\\\\dist\n');
            },
        });
    },
});
