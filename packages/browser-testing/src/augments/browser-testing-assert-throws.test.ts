import {assertTypeOf} from '@augment-vir/testing';
import {assert} from '@open-wc/testing';
import {assertThrows} from './browser-testing-assert-throws';

describe(assertThrows.name, () => {
    it('is synchronous if callback is synchronous with a message', async () => {
        // don't actually run this function, it's just for type testing
        function testTypes() {
            assertTypeOf(assertThrows(() => {}, {}, 'yo')).toEqualTypeOf<void>();
            assertTypeOf(assertThrows(() => {}, undefined, 'yo')).toEqualTypeOf<void>();
            assertTypeOf(
                assertThrows(() => {}, {matchConstructor: Error}, 'yo'),
            ).toEqualTypeOf<void>();
            assertTypeOf(assertThrows(() => {}, {matchMessage: ''}, 'yo')).toEqualTypeOf<void>();
            assertTypeOf(
                assertThrows(() => {}, {matchConstructor: Error, matchMessage: ''}, 'yo'),
            ).toEqualTypeOf<void>();
        }
    });

    it('is synchronous if callback is synchronous without a message', async () => {
        // don't actually run this function, it's just for type testing
        function testTypes() {
            assertTypeOf(assertThrows(() => {})).toEqualTypeOf<void>();
            assertTypeOf(assertThrows(() => {}, {})).toEqualTypeOf<void>();
            assertTypeOf(assertThrows(() => {}, undefined)).toEqualTypeOf<void>();
            assertTypeOf(assertThrows(() => {}, {matchConstructor: Error})).toEqualTypeOf<void>();
            assertTypeOf(assertThrows(() => {}, {matchMessage: ''})).toEqualTypeOf<void>();
            assertTypeOf(
                assertThrows(() => {}, {matchConstructor: Error, matchMessage: ''}),
            ).toEqualTypeOf<void>();
        }
    });

    it('is asynchronous if callback is asynchronous with a message', async () => {
        // don't actually run this function, it's just for type testing
        function testTypes() {
            assertTypeOf(assertThrows(async () => {}, {}, 'yo')).toEqualTypeOf<Promise<void>>();
            assertTypeOf(assertThrows(async () => {}, undefined, 'yo')).toEqualTypeOf<
                Promise<void>
            >();
            assertTypeOf(
                assertThrows(async () => {}, {matchConstructor: Error}, 'yo'),
            ).toEqualTypeOf<Promise<void>>();
            assertTypeOf(assertThrows(async () => {}, {matchMessage: ''}, 'yo')).toEqualTypeOf<
                Promise<void>
            >();
            assertTypeOf(
                assertThrows(async () => {}, {matchConstructor: Error, matchMessage: ''}, 'yo'),
            ).toEqualTypeOf<Promise<void>>();
        }
    });

    it('is asynchronous if callback is asynchronous without a message', async () => {
        // don't actually run this function, it's just for type testing
        function testTypes() {
            assertTypeOf(assertThrows(async () => {})).toEqualTypeOf<Promise<void>>();
            assertTypeOf(assertThrows(async () => {}, {matchConstructor: Error})).toEqualTypeOf<
                Promise<void>
            >();
            assertTypeOf(assertThrows(async () => {}, {matchMessage: ''})).toEqualTypeOf<
                Promise<void>
            >();
            assertTypeOf(
                assertThrows(async () => {}, {matchConstructor: Error, matchMessage: ''}),
            ).toEqualTypeOf<Promise<void>>();
        }
    });

    it('errors if no error is caught', () => {
        let caughtError: unknown = undefined;
        try {
            assertThrows(() => {});
        } catch (error) {
            caughtError = error;
        }

        assert.isDefined(caughtError);
    });

    it('errors if no error is caught from an async callback', async () => {
        let caughtError: unknown = undefined;
        try {
            await assertThrows(async () => {});
        } catch (error) {
            caughtError = error;
        }

        assert.isDefined(caughtError);
    });

    it('passes if an error is caught', () => {
        assertThrows(() => {
            throw new Error();
        });
    });

    it('passes if an error is caught from an async callback', async () => {
        await assertThrows(async () => {
            throw new Error();
        });
    });

    it('passes with matching options', () => {
        assertThrows(
            () => {
                throw new Error();
            },
            {matchConstructor: Error, matchMessage: ''},
        );
    });

    it('fails with mismatched options', () => {
        let caughtError: unknown = undefined;
        try {
            assertThrows(
                () => {
                    throw new Error();
                },
                {
                    matchMessage: 'this is a message',
                },
            );
        } catch (error) {
            caughtError = error;
        }

        assert.isDefined(caughtError);
    });
});
