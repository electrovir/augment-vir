export enum OperatingSystem {
    Linux = 'linux',
    Mac = 'mac',
    Windows = 'windows',
}

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
