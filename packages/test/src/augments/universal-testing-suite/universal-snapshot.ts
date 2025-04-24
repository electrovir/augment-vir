import {check} from '@augment-vir/assert';
import {extractErrorMessage, getOrSet, RuntimeEnv} from '@augment-vir/common';
import {
    type CompareCommandResult,
    type SnapshotPayload,
} from '@virmator/test/dist/web-snapshot-plugin/snapshot-payload.js';
import {
    extractTestName,
    isTestContext,
    type UniversalTestContext,
} from './universal-test-context.js';

/**
 * An error that is thrown from {@link assertSnapshot} when the snapshot comparison fails due to the
 * snapshot expectation file simply not existing.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export class SnapshotFileMissingError extends Error {
    constructor(testName: string) {
        super(
            `Missing snapshot file for test '${testName}'.\n\nRun tests in update mode to create the snapshot file.`,
        );
    }
}

/**
 * Assert that the given snapshot data matches already-saved snapshot file's expectations. Note that
 * the given data will be serialized into a JSON string if it is not already a string. This works in
 * both Node and web tests.
 *
 * Web tests require a web-test-runner config with the `snapshotPlugin` plugin from
 * `@virmator/test/dist/web-snapshot-plugin/web-snapshot-plugin.js` in order to work.
 *
 * @category Test
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export async function assertSnapshot(this: void, testContext: UniversalTestContext, data: unknown) {
    const {snapshotName, testName} = getTestName(testContext);
    const serializedData = check.isString(data) ? data : JSON.stringify(data);

    if (isTestContext(testContext, RuntimeEnv.Node)) {
        try {
            testContext.assert.snapshot(serializedData);
        } catch (error) {
            if (extractErrorMessage(error).includes('Cannot read snapshot file')) {
                throw new SnapshotFileMissingError(testName);
            } else {
                throw error;
            }
        }
    } else {
        const {SnapshotCommand} = await import(
            '@virmator/test/dist/web-snapshot-plugin/snapshot-payload.js'
        );
        const {executeServerCommand} = await import('@web/test-runner-commands');

        const result: CompareCommandResult = await executeServerCommand(
            SnapshotCommand.CompareSnapshot,
            {
                content: serializedData,
                name: snapshotName,
            } satisfies SnapshotPayload,
        );

        if (!result.updated) {
            if (!result.exists) {
                throw new SnapshotFileMissingError(testName);
            } else if (!result.matches) {
                throw new Error(
                    `Snapshot mismatch at '${testName}':\n\nActual: ${serializedData}\n\nExpected: ${result.savedSnapshot}\n`,
                );
            }
        }
    }
}

function getTestName(this: void, testContext: UniversalTestContext) {
    const testName = extractTestName(testContext);

    const snapshotCountObject = getOrSet(testContext, 'snapshotCount', () => {
        return {};
    });
    const currentSnapshotCount = getOrSet(snapshotCountObject, testName, () => 0);
    const newSnapshotCount = currentSnapshotCount + 1;
    snapshotCountObject[testName] = newSnapshotCount;

    const snapshotName = [
        testName,
        newSnapshotCount,
    ].join(' ');

    return {
        snapshotName,
        testName,
    };
}
