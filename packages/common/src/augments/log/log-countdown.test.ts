import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {logCountdown} from './log-countdown.js';

describe(logCountdown.name, () => {
    it('logs', async () => {
        const output: string[] = [];

        await logCountdown(3, (value) => output.push(value));

        assert.deepEquals(output, [
            '3',
            '2',
            '1',
            '0',
        ]);
    });
});
