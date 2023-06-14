import {assertTypeOf} from '@augment-vir/chai';
import {timeCallback, wait} from '@augment-vir/common';
import {assert} from 'chai';

describe(timeCallback.name, () => {
    it('measures the time', async () => {
        const waitDuration = 100;
        const measuredTime = await timeCallback(async () => {
            await wait(waitDuration);
        });

        assert.isAbove(
            measuredTime,
            waitDuration -
                // small buffer of a single frame of 60 FPS
                16,
        );
    });

    it('has proper types', () => {
        assertTypeOf(timeCallback(() => {})).toEqualTypeOf<number>();
        assertTypeOf(timeCallback(async () => {})).toEqualTypeOf<Promise<number>>();
        assertTypeOf(timeCallback((): void | Promise<void> => {})).toEqualTypeOf<
            Promise<number> | number
        >();
    });
});
