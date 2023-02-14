import {assert, expect} from 'chai';
import {describe, it} from 'mocha';
import {getSystemRootPath, interpolationSafeWindowsPath, toPosixPath} from './path';

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

describe(getSystemRootPath.name, () => {
    it('returns the system root', () => {
        assert.strictEqual(toPosixPath(getSystemRootPath()), '/');
    });
});
