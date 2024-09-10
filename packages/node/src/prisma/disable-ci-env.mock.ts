// cspell:disable

import {arrayToObject, type MaybePromise} from '@augment-vir/common';

/**
 * These are all the env flags that Prisma reads for determining if it's being executed within a CI
 * environment. This list was retrieved from
 * https://github.com/prisma/prisma/blob/075d31287c90b757fd9bd8d9b36032e6349fa671/packages/internals/src/utils/isCi.ts.
 */
const prismaCiFlags = [
    'CI',
    'CONTINUOUS_INTEGRATION',
    'BUILD_NUMBER',
    'RUN_ID',
    'AGOLA_GIT_REF',
    'AC_APPCIRCLE',
    'APPVEYOR',
    'CODEBUILD',
    'TF_BUILD',
    'bamboo_planKey',
    'BITBUCKET_COMMIT',
    'BITRISE_IO',
    'BUDDY_WORKSPACE_ID',
    'BUILDKITE',
    'CIRCLECI',
    'CIRRUS_CI',
    'CF_BUILD_ID',
    'CM_BUILD_ID',
    'CI_NAME',
    'DRONE',
    'DSARI',
    'EARTHLY_CI',
    'EAS_BUILD',
    'GERRIT_PROJECT',
    'GITEA_ACTIONS',
    'GITHUB_ACTIONS',
    'GITLAB_CI',
    'GOCD',
    'BUILDER_OUTPUT',
    'HARNESS_BUILD_ID',
    'JENKINS_URL',
    'BUILD_ID',
    'LAYERCI',
    'MAGNUM',
    'NETLIFY',
    'NEVERCODE',
    'PROW_JOB_ID',
    'RELEASE_BUILD_ID',
    'RENDER',
    'SAILCI',
    'HUDSON',
    'JENKINS_URL',
    'BUILD_ID',
    'SCREWDRIVER',
    'SEMAPHORE',
    'SOURCEHUT',
    'STRIDER',
    'TASK_ID',
    'RUN_ID',
    'TEAMCITY_VERSION',
    'TRAVIS',
    'VELA',
    'NOW_BUILDER',
    'APPCENTER_BUILD_ID',
    'CI_XCODE_PROJECT',
    'XCS',
];

export function testWithNonCiEnv(callback: () => MaybePromise<void>) {
    return async () => {
        const usedKeys = prismaCiFlags.filter((ciFlag) => ciFlag in process.env);

        const originalEnvValues = arrayToObject(usedKeys, (key) => {
            return {
                key,
                value: process.env[key],
            };
        });

        usedKeys.forEach((key) => delete process.env[key]);

        await callback();

        usedKeys.forEach((key) => (process.env[key] = originalEnvValues[key]));
    };
}
