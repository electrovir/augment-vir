import {assert} from '@augment-vir/assert';
import {mapObjectValues, omitObjectKeys} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import {join} from 'node:path';
import {monoRepoDirPath} from '../../file-paths.mock.js';
import {listAllDirectNpmDeps, PackageJsonDependencyKey} from './npm-deps.js';

describe(listAllDirectNpmDeps.name, () => {
    it('lists augment-vir deps', async () => {
        const deps = await listAllDirectNpmDeps(import.meta.dirname);

        /**
         * Remove the version values so we don't have to update this result whenever dependencies
         * are updated.
         */
        const sanitizedDeps = mapObjectValues(deps, (key, values) => {
            return values.map((value) => omitObjectKeys(value, ['versionValue']));
        });

        assert.deepEquals(sanitizedDeps, {
            'is-generator-function': [
                {
                    dependencyKey: PackageJsonDependencyKey.Overrides,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],

            pixelmatch: [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.PeerDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
            ],
            playwright: [
                {
                    dependencyKey: PackageJsonDependencyKey.Overrides,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            pngjs: [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.PeerDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
            ],
            '@augment-vir/assert': [
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'common', 'package.json'),
                    isWorkspace: true,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'node', 'package.json'),
                    isWorkspace: true,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'scripts', 'package.json'),
                    isWorkspace: true,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: true,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'web', 'package.json'),
                    isWorkspace: true,
                },
            ],
            '@augment-vir/common': [
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'node', 'package.json'),
                    isWorkspace: true,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'scripts', 'package.json'),
                    isWorkspace: true,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: true,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'web', 'package.json'),
                    isWorkspace: true,
                },
            ],
            '@augment-vir/core': [
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'assert', 'package.json'),
                    isWorkspace: true,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'common', 'package.json'),
                    isWorkspace: true,
                },
            ],
            '@augment-vir/node': [
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'scripts', 'package.json'),
                    isWorkspace: true,
                },
            ],
            '@augment-vir/test': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'node', 'package.json'),
                    isWorkspace: true,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'scripts', 'package.json'),
                    isWorkspace: true,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'web', 'package.json'),
                    isWorkspace: true,
                },
            ],
            '@date-vir/duration': [
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'assert', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'common', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'core', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'node', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'web', 'package.json'),
                    isWorkspace: false,
                },
            ],
            '@eslint/eslintrc': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            '@eslint/js': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            '@open-wc/testing-helpers': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.PeerDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
            ],
            '@paralleldrive/cuid2': [
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'common', 'package.json'),
                    isWorkspace: false,
                },
            ],
            '@playwright/test': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.PeerDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
            ],
            '@stylistic/eslint-plugin': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            '@stylistic/eslint-plugin-ts': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            '@types/deep-eql': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'assert', 'package.json'),
                    isWorkspace: false,
                },
            ],
            '@types/jsdom': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'scripts', 'package.json'),
                    isWorkspace: false,
                },
            ],
            '@types/node': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'core', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'node', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'scripts', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
            ],
            '@typescript-eslint/eslint-plugin': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            '@virmator/docs': [
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'scripts', 'package.json'),
                    isWorkspace: false,
                },
            ],
            '@virmator/test': [
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
            ],
            '@web/dev-server-esbuild': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'assert', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'common', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'node', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
            ],
            '@web/test-runner': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'assert', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'common', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'node', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
            ],
            '@web/test-runner-commands': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.PeerDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
            ],
            '@web/test-runner-playwright': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'assert', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'common', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'node', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
            ],
            '@web/test-runner-visual-regression': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.PeerDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
            ],
            'ansi-styles': [
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'common', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'node', 'package.json'),
                    isWorkspace: false,
                },
            ],
            bowser: [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'web', 'package.json'),
                    isWorkspace: false,
                },
            ],
            'browser-or-node': [
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'core', 'package.json'),
                    isWorkspace: false,
                },
            ],
            c8: [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'assert', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'core', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'node', 'package.json'),
                    isWorkspace: false,
                },
            ],
            cspell: [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            'deep-eql': [
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'assert', 'package.json'),
                    isWorkspace: false,
                },
            ],
            'deepcopy-esm': [
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'common', 'package.json'),
                    isWorkspace: false,
                },
            ],
            'dependency-cruiser': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            diff: [
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'core', 'package.json'),
                    isWorkspace: false,
                },
            ],
            'element-vir': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.PeerDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.PeerDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'web', 'package.json'),
                    isWorkspace: false,
                },
            ],
            esbuild: [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.Overrides,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            eslint: [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            'eslint-config-prettier': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            'eslint-plugin-jsdoc': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            'eslint-plugin-monorepo-cop': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            'eslint-plugin-playwright': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            'eslint-plugin-prettier': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            'eslint-plugin-require-extensions': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            'eslint-plugin-sonarjs': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            'eslint-plugin-unicorn': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            'execute-in-browser': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'common', 'package.json'),
                    isWorkspace: false,
                },
            ],
            'expect-type': [
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'assert', 'package.json'),
                    isWorkspace: false,
                },
            ],
            'html-spec-tags': [
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'web', 'package.json'),
                    isWorkspace: false,
                },
            ],
            'istanbul-smart-text-reporter': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'assert', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'common', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'core', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'node', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
            ],
            jsdom: [
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'scripts', 'package.json'),
                    isWorkspace: false,
                },
            ],
            json5: [
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'common', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'core', 'package.json'),
                    isWorkspace: false,
                },
            ],
            'mono-vir': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            'npm-check-updates': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            'patch-package': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            prettier: [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            'prettier-plugin-interpolated-html-tags': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            'prettier-plugin-jsdoc': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            'prettier-plugin-multiline-arrays': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            'prettier-plugin-organize-imports': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            'prettier-plugin-packagejson': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            'prettier-plugin-sort-json': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            'prettier-plugin-toml': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            runstorm: [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'common', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
            ],
            'sanitize-filename': [
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'node', 'package.json'),
                    isWorkspace: false,
                },
            ],
            sharp: [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.PeerDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
            ],
            'spa-router-vir': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.PeerDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
            ],
            terminate: [
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'node', 'package.json'),
                    isWorkspace: false,
                },
            ],
            tsx: [
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'node', 'package.json'),
                    isWorkspace: false,
                },
            ],
            'type-fest': [
                {
                    dependencyKey: PackageJsonDependencyKey.Overrides,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'assert', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'common', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'core', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'node', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'scripts', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'web', 'package.json'),
                    isWorkspace: false,
                },
            ],
            'typed-event-target': [
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'common', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'node', 'package.json'),
                    isWorkspace: false,
                },
            ],
            typedoc: [
                {
                    dependencyKey: PackageJsonDependencyKey.Dependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'scripts', 'package.json'),
                    isWorkspace: false,
                },
            ],
            typescript: [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'assert', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'common', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'core', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'node', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.PeerDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'node', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'scripts', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'web', 'package.json'),
                    isWorkspace: false,
                },
            ],
            'typescript-eslint': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
            'url-vir': [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
                {
                    dependencyKey: PackageJsonDependencyKey.PeerDependencies,
                    requiredBy: join(monoRepoDirPath, 'packages', 'test', 'package.json'),
                    isWorkspace: false,
                },
            ],
            virmator: [
                {
                    dependencyKey: PackageJsonDependencyKey.DevDependencies,
                    requiredBy: join(monoRepoDirPath, 'package.json'),
                    isWorkspace: false,
                },
            ],
        });
    });
});
