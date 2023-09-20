import {isPromiseLike, wait} from '@augment-vir/common';
import {expect} from 'chai';
import {describe, it} from 'mocha';
import {expectDuration} from './assert';

describe(expectDuration.name, () => {
    it('should not return a promise when the callback is synchronous', () => {
        const expectation = expectDuration(expect, () => {
            // do nothing
        });
        expect(isPromiseLike(expectation)).to.equal(false);
        expectation.to.be.greaterThanOrEqual(0);
    });

    it('should return a promise when the callback is asynchronous', async () => {
        const duration = 100;
        const expectation = expectDuration(expect, async () => {
            await wait(duration);
        });
        expect(isPromiseLike(expectation)).to.equal(true);
        (await expectation).to.be.greaterThanOrEqual(0);
    });
});
