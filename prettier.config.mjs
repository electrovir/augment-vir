import {omitObjectKeys} from '@augment-vir/common';
import {basePrettierConfig} from '@virmator/format/configs/prettier.config.base.mjs';

/**
 * @typedef {import('prettier-plugin-multiline-arrays').MultilineArrayOptions} MultilineOptions
 *
 * @typedef {import('prettier').Options} PrettierOptions
 * @type {PrettierOptions & MultilineOptions}
 */
const prettierConfig = {
    ...omitObjectKeys(basePrettierConfig, ['multilineArraysWrapThreshold']),
    /**
     * Formatting without my own plugins so they actually work in VS Code (otherwise they circularly
     * depend too much on this package itself).
     */
    plugins: [
        'prettier-plugin-toml',
        'prettier-plugin-sort-json',
        'prettier-plugin-packagejson',
        'prettier-plugin-organize-imports',
        'prettier-plugin-jsdoc',
    ],
};

export default prettierConfig;
