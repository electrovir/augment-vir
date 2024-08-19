import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {join, sep} from 'node:path';
import {
    getSystemRootPath,
    interpolationSafeWindowsPath,
    joinFileNamesWithParentDirPath,
    replaceWithWindowsPathIfNeeded,
    toPosixPath,
} from './path.js';

describe(replaceWithWindowsPathIfNeeded.name, () => {
    it('works', () => {
        assert.strictEquals(
            replaceWithWindowsPathIfNeeded('a/b'),
            [
                'a',
                'b',
            ].join(sep),
        );
    });
});

describe(interpolationSafeWindowsPath.name, () => {
    it('with drive letter', () => {
        assert.strictEquals(
            interpolationSafeWindowsPath('D:\\a\\virmator\\virmator\\dist\n'),
            'D:\\\\\\\\a\\\\\\\\virmator\\\\\\\\virmator\\\\\\\\dist\n',
        );
    });
});

describe(joinFileNamesWithParentDirPath.name, () => {
    it('works', () => {
        assert.deepEquals(
            joinFileNamesWithParentDirPath(join('a', 'b'), [
                'c',
                'd',
                'e',
                'f',
            ]),
            [
                join('a', 'b', 'c'),
                join('a', 'b', 'd'),
                join('a', 'b', 'e'),
                join('a', 'b', 'f'),
            ],
        );
    });
});

describe(toPosixPath.name, () => {
    it('with drive letter', () => {
        assert.strictEquals(
            toPosixPath('D:\\a\\virmator\\virmator\\dist\n'),
            '/d/a/virmator/virmator/dist\n',
        );
    });

    it('with double escaped path', () => {
        assert.strictEquals(
            toPosixPath('D:\\\\a\\\\virmator\\\\virmator\\\\dist\n'),
            '/d/a/virmator/virmator/dist\n',
        );
    });
});

describe(getSystemRootPath.name, () => {
    it('returns the system root', () => {
        if (sep === '/') {
            assert.strictEquals(toPosixPath(getSystemRootPath()), '/');
        } else {
            assert.matches(toPosixPath(getSystemRootPath()), /\/\w\//);
        }
    });
});
