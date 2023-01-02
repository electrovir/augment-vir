import {getWebTestRunnerConfigWithCoveragePercent} from 'virmator/base-configs/base-web-test-runner.mjs';

/** @type {import('@web/test-runner').TestRunnerConfig} */
const webTestRunnerConfig = {
    ...getWebTestRunnerConfigWithCoveragePercent(100),
};

export default webTestRunnerConfig;
