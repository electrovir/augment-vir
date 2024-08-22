import type {WaitUntilOptions} from './augments/guard-types/wait-until-function.js';

export const waitUntilTestOptions: WaitUntilOptions = {
    interval: {
        milliseconds: 1,
    },
    timeout: {
        seconds: 1,
    },
};
