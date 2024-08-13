import type {WaitUntilOptions} from './guard-types/wait-until-function.js';

export const waitUntilTestOptions: WaitUntilOptions = {
    interval: {
        milliseconds: 1,
    },
    timeout: {
        seconds: 1,
    },
};
