import {baseNcuConfig} from '@virmator/deps/configs/ncu.config.base';
import {RunOptions} from 'npm-check-updates';

export const ncuConfig: RunOptions = {
    ...baseNcuConfig,
    // exclude these
    reject: [
        ...baseNcuConfig.reject,
        // typedoc is not compatible with 5.7 yet
        'typescript',
        // eslint 9.15 is broken
        'eslint',
    ],
    // include only these
    filter: [],
};
