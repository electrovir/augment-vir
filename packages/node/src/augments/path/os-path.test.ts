import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {sep} from 'node:path';
import {
    interpolationSafeWindowsPath,
    replaceWithWindowsPathIfNeeded,
    toPosixPath,
} from './os-path.js';

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
