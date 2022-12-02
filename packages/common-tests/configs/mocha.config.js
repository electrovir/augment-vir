const baseOptions = require('virmator/base-configs/base-mocharc.js');

/** @type {import('mocha').MochaOptions} */
const mochaConfig = {
    ...baseOptions,
    fullTrace: true,
    require: ['tsx'],
};

module.exports = mochaConfig;
