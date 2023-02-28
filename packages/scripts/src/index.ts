import {combineErrorMessages} from '@augment-vir/common';
import {log} from '@augment-vir/node-js';
import {Promisable} from 'type-fest';
import {assertAllAugmentsExported} from './scripts/verify-all-augments-are-exported';

const verifications: (() => Promisable<Error[]>)[] = [assertAllAugmentsExported];

async function runAllVerifications() {
    const errors = (
        await Promise.all(verifications.map(async (verification) => await verification()))
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
