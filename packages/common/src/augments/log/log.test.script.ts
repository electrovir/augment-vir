import {getEnumValues} from '@augment-vir/core';
import {LogColorKey} from './log-colors.js';
import {log} from './log.js';

function logAllColors() {
    getEnumValues(LogColorKey).forEach((colorKey) => {
        log[colorKey](colorKey);
    });
}

/**
 * To see the browser colors:
 *
 *     cd packages/common && npx b-run src/augments/log/log.test.script.ts
 *
 * To see the node colors:
 *
 *     cd packages/common && npx tsx src/augments/log/log.test.script.ts
 */
logAllColors();
