/**
 * The three major operating system types.
 *
 * @category Node : OS
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export enum OperatingSystem {
    Linux = 'linux',
    Mac = 'mac',
    Windows = 'windows',
}

/**
 * The current operating system type, as deduced from
 * [`process.platform`](https://nodejs.org/api/process.html#processplatform).
 *
 * @category Node : OS
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export const currentOperatingSystem: OperatingSystem = getOperatingSystem();

/**
 * Checks if the current operating system is the requested one.
 *
 * @category Node : OS
 * @category Package : @augment-vir/node
 * @example
 *
 * ```ts
 * import {isOperatingSystem, OperatingSystem} from '@augment-vir/node';
 *
 * if (isOperatingSystem(OperatingSystem.Mac)) {
 *     // do something
 * }
 * ```
 *
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export function isOperatingSystem(operatingSystem: OperatingSystem): boolean {
    return currentOperatingSystem === operatingSystem;
}

function getOperatingSystem(): OperatingSystem {
    /** We can't test all of these on a single system. */
    /* node:coverage ignore next 7 */
    if (process.platform === 'win32') {
        return OperatingSystem.Windows;
    } else if (process.platform === 'darwin') {
        return OperatingSystem.Mac;
    } else {
        return OperatingSystem.Linux;
    }
}
