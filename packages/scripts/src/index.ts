import {combineErrorMessages, ensureError} from '@augment-vir/common';
import {log} from '@augment-vir/node-js';
import {Promisable} from 'type-fest';
import {updateAllInternalAugmentVirDeps} from './scripts/update-all-augment-vir-deps';
import {assertAllAugmentsExported} from './scripts/verify-all-augments-are-exported';

const verifications: (() => Promisable<Error[]>)[] = [
    assertAllAugmentsExported,
    updateAllInternalAugmentVirDeps,
];

async function runAllVerifications() {
    const errors = (
        await Promise.all(
            verifications.map(async (verification): Promise<Error[]> => {
                try {
                    return await verification();
                } catch (error) {
                    return [ensureError(error)];
                }
            }),
        )
    ).flat();

    if (errors.length) {
        throw combineErrorMessages(errors);
    }
}

runAllVerifications().catch((error) => {
    log.error(error);
    console.info('\n');
    process.exit(1);
});
