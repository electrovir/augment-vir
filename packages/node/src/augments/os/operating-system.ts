/**
 * The three major operating system types.
 *
 * @category Node : OS
 * @category Package : @augment-vir/node
 * @package @augment-vir/node
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
 * @package @augment-vir/node
 */
export const currentOperatingSystem: OperatingSystem = getOperatingSystem();

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
