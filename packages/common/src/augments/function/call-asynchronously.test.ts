import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {randomString} from '../random/random-string.js';
import {callAsynchronously} from './call-asynchronously.js';

describe(callAsynchronously.name, () => {
    it('does not interrupt synchronous code order', async () => {
        const values: number[] = [];
        values.push(1);
        const asyncOutput = callAsynchronously(() => {
            values.push(3);
        });
        values.push(2);
        await asyncOutput;
        assert.deepEquals(
            values,
            [
                1,
                2,
                3,
            ],
        );
    });

    it("returns the callback's output", async () => {
        const randomValue = randomString();

        assert.strictEquals(await callAsynchronously(() => randomValue), randomValue);
    });

    it('logs in the correct order', async () => {
        console.info('1');
        const later = callAsynchronously(() => {
            console.info('3');
        });
        console.info('2');
        await later;
    });
});
