import {type RequiredAndNotNull} from '@augment-vir/core';
import {type WaitUntilOptions} from './guard-types/wait-until-function.js';

export const waitUntilTestOptions: RequiredAndNotNull<WaitUntilOptions> = {
    interval: {
        milliseconds: 1,
    },
    timeout: {
        seconds: 1,
    },
};
