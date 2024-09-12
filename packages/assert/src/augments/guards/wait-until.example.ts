import {waitUntil} from '@augment-vir/assert';

// `result` will eventually be `'123'`
const result = await waitUntil.isString(
    () => {
        if (Math.random() < 0.5) {
            return 123;
        } else {
            return '123';
        }
    },
    {
        interval: {milliseconds: 100},
        timeout: {seconds: 10},
    },
);
