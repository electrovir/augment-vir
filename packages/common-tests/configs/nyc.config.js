const {getBaseConfigWithCoveragePercent} = require('virmator/base-configs/base-nyc.js');

const nycConfig = {
    ...getBaseConfigWithCoveragePercent(0),
    cwd: '../',
    include: [
        'common/src/**/*.ts',
        'common-tests/src/**/*.ts',
    ],
    tempDir: './common-tests/node_modules/.nyc-output/',
    reportDir: './common-tests/coverage/',
};

module.exports = nycConfig;
