import {assert} from '@augment-vir/assert';
import {randomString} from '@augment-vir/common';
import {describe, it, itCases} from '@augment-vir/test';
import {dirname, join, relative} from 'node:path';
import {monoRepoDirPath} from '../../file-paths.mock.js';
import {resolveImportPath} from './resolve-import.js';

describe(resolveImportPath.name, () => {
    function testResolveImportPath(importPath: string): string | undefined {
        const resolvedImportPath = resolveImportPath(import.meta.filename, importPath);

        if (resolvedImportPath) {
            return relative(monoRepoDirPath, resolvedImportPath);
        } else {
            return resolvedImportPath;
        }
    }

    itCases(testResolveImportPath, [
        {
            it: 'handles a relative import',
            input: '../some/file.js',
            expect: join('packages', 'node', 'src', 'augments', 'some', 'file.js'),
        },
        {
            it: 'maps js to ts',
            input: './resolve-import.js',
            expect: join('packages', 'node', 'src', 'augments', 'path', 'resolve-import.ts'),
        },
        {
            it: 'handles a package import',
            input: 'virmator',
            expect: join('node_modules', 'virmator'),
        },
        {
            it: 'resolves a symlink',
            input: '@augment-vir/common',
            expect: join('packages', 'common'),
        },
        {
            it: "rejects a package import that doesn't exist",
            input: `fake-package-does-not-exist-and-cannot-exist-anywhere-${randomString()}`,
            expect: undefined,
        },
        {
            it: 'maps tsconfig aliases',
            input: join('something-crazy', 'index.ts'),
            expect: join('packages', 'node', 'src', 'index.ts'),
        },
    ]);

    it('handles a missing tsconfig', () => {
        const outsideOfPackage = join(dirname(monoRepoDirPath), 'a.js');

        assert.strictEquals(
            relative(monoRepoDirPath, resolveImportPath(outsideOfPackage, './b.js') || ''),
            join('..', 'b.js'),
        );
    });
    it('handles a tsconfig without path aliases', () => {
        const commonFile = join(monoRepoDirPath, 'packages', 'common', 'src', 'index.ts');

        assert.strictEquals(
            relative(monoRepoDirPath, resolveImportPath(commonFile, './b.js') || ''),
            join('packages', 'common', 'src', 'b.js'),
        );
    });
});
