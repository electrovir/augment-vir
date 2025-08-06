import {wait} from '@augment-vir/core';
import {log} from './log.js';

/**
 * Logs each second as a countdown, then resolves.
 *
 * @category Log
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export async function logCountdown(
    start: number,
    logCallback: (value: string) => void = log.warning,
): Promise<void> {
    logCallback(String(start));

    await wait({seconds: 1.5});
    if (start) {
        return await logCountdown(start - 1);
    } else {
        return;
    }
}
