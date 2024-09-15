import {type MaybePromise} from '@augment-vir/common';
import {isOperatingSystem, OperatingSystem} from '../augments/os/operating-system.js';

export function dockerTest(callback: () => MaybePromise<void>) {
    if (!isOperatingSystem(OperatingSystem.Linux) && process.env.CI) {
        /**
         * We cannot test Docker on macOS GitHub Actions runners.
         *
         * @see
         * - https://github.com/actions/runner-images/issues/8104
         * - https://github.com/douglascamata/setup-docker-macos-action?tab=readme-ov-file#arm64-processors-m1-m2-m3-series-used-on-macos-14-images-are-unsupported
         * - https://github.com/actions/runner-images/issues/2150
         * - https://github.com/actions/runner/issues/1456
         */
        /**
         * We cannot test Docker on Windows GitHub Actions runners because Docker cannot run in
         * Linux container mode on Windows GitHub Actions runners.
         *
         * @see
         * - https://github.com/orgs/community/discussions/25491#discussioncomment-3248089
         */
        return () => {};
    }

    return callback;
}
