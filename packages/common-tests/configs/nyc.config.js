const {getBaseConfigWithCoveragePercent} = require('virmator/base-configs/base-nyc.js');

const nycConfig = {
    ...getBaseConfigWithCoveragePercent(100),
    cwd: '../',
    include: [
        'common/src/**/*.ts',
        'common-tests/src/**/*.ts',
    ],
};

module.exports = nycConfig;
