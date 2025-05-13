const {baseConfig} = require('@virmator/spellcheck/configs/cspell.config.base.cjs');

module.exports = {
    ...baseConfig,
    ignorePaths: [
        ...baseConfig.ignorePaths,
        'packages/test/src/mocha.d.ts',
        'packages/node/test-files/migrations/',
    ],
    words: [
        ...baseConfig.words,
        'nocheck',
        'propstat',
        'resolv',
        'prismock',
        'alea',
        'baagøe',
    ],
};
