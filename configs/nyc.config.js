const {getBaseConfigWithCoveragePercent} = require('virmator/base-configs/base-nyc.js');

const nycConfig = {
    ...getBaseConfigWithCoveragePercent(0),
    exclude: ['test-files'],
};

module.exports = nycConfig;
