import {assert} from '@augment-vir/assert';
import {wait} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {racePromiseObject} from './race-object.js';

describe(racePromiseObject.name, () => {
    it('gives the key that finishes', async () => {
        assert.deepEquals(
            await racePromiseObject({
                first: wait({milliseconds: 1}),
                second: wait({seconds: 1}),
            }),
            {key: 'first', value: undefined},
        );
    });
});
