import {RunOptions} from 'npm-check-updates';
import {baseNcuConfig} from 'virmator/dist/compiled-base-configs/base-ncu';

export const ncuConfig: RunOptions = {
    color: true,
    upgrade: true,
    root: true,
    // exclude these
    reject: [
        ...baseNcuConfig.reject,
        'expect-type',
        /** V5 requires type: module, which we are not yet ready for */
        'chai',
    ],
    // include only these
    filter: [],
};
