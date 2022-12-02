import {isPromiseLike, wait} from '@augment-vir/common';
import {assert, expect} from 'chai';
import {describe, it} from 'mocha';
import {expectDuration, typedAssertInstanceOf, typedAssertNotNullish} from './assert';

describe(typedAssertInstanceOf.name, () => {
    it('should pass', () => {
        // expect.assertions(1);
        typedAssertInstanceOf(assert, new Error(), Error);
    });

    it('should fail', () => {
        // expect.assertions(2);
        try {
            typedAssertInstanceOf(assert, '', Error);
        } catch (error) {
            expect(error).to.be.instanceOf(Error);
        }
    });

    it('should propagate type info', () => {
        const message = 'This is a message.';

        const mystery: unknown = new Error(message);

        // @ts-expect-error
        expect(mystery.message).to.equal(message);

        typedAssertInstanceOf(assert, mystery, Error);

        // should not have a TypeScript error here
        expect(mystery.message).to.equal(message);
    });
});

describe(typedAssertNotNullish.name, () => {
    it('should pass on defined, not null values', () => {
        const values = [
            '',
            0,
            5,
            42,
            'hello',
            new Error(),
            'zero',
            [],
            {},
        ];

        // expect.assertions(values.length * 2);

        values.forEach((value) => {
            typedAssertNotNullish(assert, value);
        });
    });

    it('should fail on undefined and null values', () => {
        const values = [
            undefined,
            null,
        ];

        /**
         * This value is wonky because typedAssertNotNullish creates 2 assertions for undefined but
         * only 1 for null.
         */
        // expect.assertions(6);

        const errors = values.map((value) => {
            try {
                typedAssertNotNullish(assert, value);
            } catch (error) {
                return error;
            }
        });

        expect(errors.length).to.equal(values.length);
        errors.forEach((error) => {
            expect(error).to.be.instanceOf(Error);
        });
    });

    it('should propagate type information', () => {
        const possiblyUndefined: number | undefined = 5 as number | undefined;

        function onlyAcceptNumbers(a: number, b: number): number {
            return a + b;
        }

        // @ts-expect-error
        expect(onlyAcceptNumbers(possiblyUndefined, 2)).to.equal(7);

        typedAssertNotNullish(assert, possiblyUndefined);

        // should not have a TypeScript error here
        expect(onlyAcceptNumbers(possiblyUndefined, 2)).to.equal(7);
    });
});

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
