const {baseConfig} = require('@virmator/spellcheck/configs/cspell.config.base.cjs');

module.exports = {
    ...baseConfig,
    ignorePaths: [
        ...baseConfig.ignorePaths,
        'packages/test/src/mocha.d.ts',
    ],
    words: [
        ...baseConfig.words,
        'nocheck',
        'propstat',
    ],
};
