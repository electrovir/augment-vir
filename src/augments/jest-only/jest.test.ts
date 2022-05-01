import {isPromiseLike, wait} from '../promise';
import {assertInstanceOf, assertNotNullish, expectDuration} from './jest';

describe(assertInstanceOf.name, () => {
    it('should pass', () => {
        expect.assertions(1);
        assertInstanceOf(new Error(), Error);
    });

    it('should fail', () => {
        expect.assertions(2);
        try {
            assertInstanceOf('', Error);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    it('should propagate type info', () => {
        const message = 'This is a message.';

        const mystery: unknown = new Error(message);

        // @ts-expect-error
        expect(mystery.message).toBe(message);

        assertInstanceOf(mystery, Error);

        // should not have a TypeScript error here
        expect(mystery.message).toBe(message);
    });
});

describe(assertNotNullish.name, () => {
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

        expect.assertions(values.length * 2);

        values.forEach((value) => {
            assertNotNullish(value);
        });
    });

    it('should fail on undefined and null values', () => {
        const values = [
            undefined,
            null,
        ];

        /**
         * This value is wonky because assertNotNullish creates 2 assertions for undefined but only
         * 1 for null.
         */
        expect.assertions(6);

        const errors = values.map((value) => {
            try {
                assertNotNullish(value);
            } catch (error) {
                return error;
            }
        });

        expect(errors.length).toBe(values.length);
        errors.forEach((error) => {
            expect(error).toBeInstanceOf(Error);
        });
    });

    it('should propagate type information', () => {
        const possiblyUndefined: number | undefined = 5 as number | undefined;

        function onlyAcceptNumbers(a: number, b: number): number {
            return a + b;
        }

        // @ts-expect-error
        expect(onlyAcceptNumbers(possiblyUndefined, 2)).toBe(7);

        assertNotNullish(possiblyUndefined);

        // should not have a TypeScript error here
        expect(onlyAcceptNumbers(possiblyUndefined, 2)).toBe(7);
    });
});

describe(expectDuration.name, () => {
    it('should not return a promise when the callback is synchronous', () => {
        const expectation = expectDuration(() => {
            // do nothing
        });
        expect(isPromiseLike(expectation)).toBe(false);
        expectation.toBeGreaterThanOrEqual(0);
    });

    it('should return a promise when the callback is asynchronous', async () => {
        const duration = 100;
        const expectation = expectDuration(async () => {
            await wait(duration);
        });
        expect(isPromiseLike(expectation)).toBe(true);
        (await expectation).toBeGreaterThanOrEqual(0);
    });
});
