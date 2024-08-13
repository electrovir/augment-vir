import {assert, describe, it} from '@augment-vir/test';
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
        assert.deepStrictEqual(
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

        assert.areStrictEqual(await callAsynchronously(() => randomValue), randomValue);
    });
});
