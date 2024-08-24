import {describe, it} from '@augment-vir/test';
import {waitUntilTestOptions} from '../../test-timeout.mock.js';
import {assert} from './assert.js';
import {waitUntil} from './wait-until.js';

describe('waitUntil', () => {
    it('has proper types', async () => {
        let count = 0;
        const result = await waitUntil.isTrue(() => {
            if (count < 3) {
                ++count;
                return 'hi';
            } else {
                return true;
            }
        });

        assert.tsType(result).equals<true>();
    });
    it('resolves once a condition is true', async () => {
        let condition = false;
        await waitUntil.isTrue(() => {
            if (condition) {
                return true;
            } else {
                condition = true;
                return false;
            }
        });
        assert.isTrue(condition);
    });

    it('waits until the condition is true', async () => {
        let condition = false;
        setTimeout(() => {
            condition = true;
        }, 1000);
        assert.isFalse(condition);
        await waitUntil.isTrue(() => {
            return condition;
        });
        assert.isTrue(condition);
    });

    it('waits until the condition is true with an async callback', async () => {
        let condition = false;
        setTimeout(() => {
            condition = true;
        }, 1000);
        assert.isFalse(condition);
        await waitUntil.isTrue(async () => {
            return Promise.resolve(condition);
        });
    });

    it('handles errors', async () => {
        const errorMessage = 'some error message';

        await assert.throws(
            waitUntil.isTrue(() => {
                throw new Error(errorMessage);
            }, waitUntilTestOptions),
            {
                matchMessage: errorMessage,
            },
        );
    });

    it('uses timeoutMessage', async () => {
        const timeoutMessage = 'some message';

        await assert.throws(
            waitUntil.isTrue(
                () => {
                    return false;
                },
                waitUntilTestOptions,
                timeoutMessage,
            ),
            {
                matchMessage: timeoutMessage,
            },
        );
    });
});
