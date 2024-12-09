import {basePrettierConfig} from '@virmator/format/configs/prettier.config.base.mjs';

/**
 * @typedef {import('prettier-plugin-multiline-arrays').MultilineArrayOptions} MultilineOptions
 *
 * @typedef {import('prettier').Options} PrettierOptions
 * @type {PrettierOptions & MultilineOptions}
 */
const prettierConfig = {
    ...basePrettierConfig,
    plugins: [
        'prettier-plugin-toml',
        'prettier-plugin-sort-json',
        'prettier-plugin-packagejson',
        'prettier-plugin-organize-imports',
        'prettier-plugin-jsdoc',
    ],
};

export default prettierConfig;
