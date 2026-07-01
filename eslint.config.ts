import {defineEslintConfig} from '@virmator/lint/configs/eslint.config.base.js';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
    ...defineEslintConfig(__dirname),
    {
        ignores: [
            /** Add file globs that should be ignored. */
        ],
    },
    {
        rules: {
            /**
             * Turn off or on specific rules. See {@link defineEslintConfig} for which plugins are
             * already enabled.
             */
            '@jsdoc/no-undefined-types': 'off',
        },
    },
    {
        files: [
            'packages/assert/**/*.ts',
        ],
        rules: {
            /**
             * The assert package intentionally exposes assertion functions with positional
             * `(actual, expected, failureMessage)` style params (matching the conventions of
             * established assertion libraries), which inherently use multiple same-typed params.
             */
            '@virmator/prefer-params-object': 'off',
        },
    },
];
