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
        'alea',
        'baagøe',
        'customizer',
        'deepcopy',
        'domcontentloaded',
        'nocheck',
        'prismock',
        'propstat',
        'resolv',
        'runstorm',
    ],
};
