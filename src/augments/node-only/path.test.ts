import {expect} from 'chai';
import {describe, it} from 'mocha';
import {sep} from 'path';
import {getRepoRootDir, interpolationSafeWindowsPath, toPosixPath} from './path';

describe(getRepoRootDir.name, () => {
    it('basic test ends with repo name', () => {
        const splitPath = getRepoRootDir()
            .split(sep)
            // remove empty dirs from splitting around beginning or ending "/"
            .filter((dir) => !!dir);
        expect(splitPath[splitPath.length - 1]).to.equal('augment-vir');
    });
});

describe(interpolationSafeWindowsPath.name, () => {
    it('with drive letter', () => {
        expect(interpolationSafeWindowsPath('D:\\a\\virmator\\virmator\\dist\n')).to.equal(
            'D:\\\\\\\\a\\\\\\\\virmator\\\\\\\\virmator\\\\\\\\dist\n',
        );
    });
});

describe(toPosixPath.name, () => {
    it('with drive letter', () => {
        expect(toPosixPath('D:\\a\\virmator\\virmator\\dist\n')).to.equal(
            '/d/a/virmator/virmator/dist\n',
        );
    });

    it('with double escaped path', () => {
        expect(toPosixPath('D:\\\\a\\\\virmator\\\\virmator\\\\dist\n')).to.equal(
            '/d/a/virmator/virmator/dist\n',
        );
    });
});
