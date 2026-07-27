import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type PackageJson} from './package-json.js';

const packageJson: PackageJson = {};

describe('PackageJson', () => {
    it('types standard string fields', () => {
        assert.tsType(packageJson.name).equals<string | undefined>();
        assert.tsType(packageJson.version).equals<string | undefined>();
        assert.tsType(packageJson.description).equals<string | undefined>();
        assert.tsType(packageJson.license).equals<string | undefined>();
        assert.tsType(packageJson.main).equals<string | undefined>();
        assert.tsType(packageJson.packageManager).equals<string | undefined>();
        assert.tsType(packageJson.types).equals<string | undefined>();
        assert.tsType(packageJson.typings).equals<string | undefined>();
        assert.tsType(packageJson.module).equals<string | undefined>();
    });

    it('types array fields', () => {
        assert.tsType(packageJson.keywords).equals<string[] | undefined>();
        assert.tsType(packageJson.files).equals<string[] | undefined>();
        assert.tsType(packageJson.bundleDependencies).equals<string[] | undefined>();
        assert.tsType(packageJson.bundledDependencies).equals<string[] | undefined>();
        assert.tsType(packageJson.man).equals<string | string[] | undefined>();
    });

    it('types boolean fields', () => {
        assert.tsType(packageJson.engineStrict).equals<boolean | undefined>();
        assert.tsType(packageJson.preferGlobal).equals<boolean | undefined>();
        assert.tsType(packageJson.private).equals<boolean | undefined>();
    });

    it('types dependency maps', () => {
        assert
            .tsType(packageJson.dependencies)
            .equals<Partial<Record<string, string>> | undefined>();
        assert
            .tsType(packageJson.devDependencies)
            .equals<Partial<Record<string, string>> | undefined>();
        assert
            .tsType(packageJson.optionalDependencies)
            .equals<Partial<Record<string, string>> | undefined>();
        assert
            .tsType(packageJson.peerDependencies)
            .equals<Partial<Record<string, string>> | undefined>();
    });

    it('types structured fields', () => {
        assert
            .tsType(packageJson.bugs)
            .equals<string | {url?: string; email?: string} | undefined>();
        assert
            .tsType(packageJson.bin)
            .equals<string | Partial<Record<string, string>> | undefined>();
        assert
            .tsType(packageJson.repository)
            .equals<string | {type: string; url: string; directory?: string} | undefined>();
        assert
            .tsType(packageJson.workspaces)
            .equals<string[] | {packages?: string[]; nohoist?: string[]} | undefined>();
        assert.tsType(packageJson.jspm).equals<PackageJson | undefined>();
    });

    it('types fields that use a literal union', () => {
        assert.tsType(packageJson.homepage).matches<string | undefined>();
        assert.tsType(packageJson.os).matches<string[] | undefined>();
        assert.tsType(packageJson.cpu).matches<string[] | undefined>();
    });

    it('accepts a realistic package.json object', () => {
        const realisticPackageJson = {
            name: 'my-package',
            version: '1.0.0',
            description: 'A test package.',
            keywords: [
                'test',
                'example',
            ],
            license: 'MIT',
            main: './index.js',
            type: 'module',
            dependencies: {
                'some-dependency': '^1.0.0',
            },
            devDependencies: {
                'some-dev-dependency': '^2.0.0',
            },
            private: true,
        } satisfies PackageJson;

        assert.tsType(realisticPackageJson).matches<PackageJson>();
    });

    it('rejects fields with the wrong type', () => {
        const badName: PackageJson = {
            // @ts-expect-error: `name` must be a string, not a number.
            name: 123,
        };
        const badVersion: PackageJson = {
            // @ts-expect-error: `version` must be a string, not a boolean.
            version: false,
        };
    });

    it('allows undefined values in map-like fields', () => {
        assert
            .tsType({
                dependency: undefined,
            })
            .matches<PackageJson['dependencies']>();
        assert
            .tsType({
                engine: undefined,
            })
            .matches<PackageJson['engines']>();
        assert
            .tsType({
                unknownScript: undefined,
            })
            .matches<PackageJson['scripts']>();
        assert
            .tsType({
                bin: undefined,
            })
            .matches<PackageJson['bin']>();
    });

    it('allows nested dependency overrides', () => {
        assert
            .tsType({
                foo: '1.0.0',
            })
            .matches<PackageJson['overrides']>();
        assert
            .tsType({
                foo: {
                    '.': '1.0.0',
                    bar: '1.0.0',
                },
            })
            .matches<PackageJson['overrides']>();
        assert
            .tsType({
                baz: {
                    bar: {
                        foo: '1.0.0',
                    },
                },
            })
            .matches<PackageJson['overrides']>();
        assert
            .tsType({
                foo: undefined,
            })
            .matches<PackageJson['overrides']>();
        assert
            .tsType({
                foo: {
                    bar: undefined,
                },
            })
            .matches<PackageJson['overrides']>();
    });

    it('relates to a generic record type', () => {
        assert.tsType(packageJson).matches<Record<string, unknown>>();
        assert.tsType<Record<string, unknown>>().notMatches<PackageJson>();
    });
});
