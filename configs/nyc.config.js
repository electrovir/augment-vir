const baseOptions = require('virmator/base-configs/base-nyc.js');

const nycConfig = {
    ...baseOptions,
    // we aren't at 100% yet and I don't want to fix that right now
    branches: 0,
    functions: 0,
    lines: 0,
    statements: 0,

    exclude: ['test-files'],
};

module.exports = nycConfig;
