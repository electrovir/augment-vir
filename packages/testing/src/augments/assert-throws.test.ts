import {assert} from 'chai';
import {assertThrows} from './assert-throws';
import {assertTypeOf} from './assert-type-of';

describe(assertThrows.name, () => {
    it('is synchronous if callback is synchronous with a message', async () => {
        // don't actually run this function, it's just for type testing
        function testTypes() {
            assertTypeOf(assertThrows(assert, () => {}, {}, 'yo')).toEqualTypeOf<void>();
            assertTypeOf(assertThrows(assert, () => {}, undefined, 'yo')).toEqualTypeOf<void>();
            assertTypeOf(
                assertThrows(assert, () => {}, {matchConstructor: Error}, 'yo'),
            ).toEqualTypeOf<void>();
            assertTypeOf(
                assertThrows(assert, () => {}, {matchMessage: ''}, 'yo'),
            ).toEqualTypeOf<void>();
            assertTypeOf(
                assertThrows(assert, () => {}, {matchConstructor: Error, matchMessage: ''}, 'yo'),
            ).toEqualTypeOf<void>();
        }
    });

    it('is synchronous if callback is synchronous without a message', async () => {
        // don't actually run this function, it's just for type testing
        function testTypes() {
            assertTypeOf(assertThrows(assert, () => {})).toEqualTypeOf<void>();
            assertTypeOf(assertThrows(assert, () => {}, {})).toEqualTypeOf<void>();
            assertTypeOf(assertThrows(assert, () => {}, undefined)).toEqualTypeOf<void>();
            assertTypeOf(
                assertThrows(assert, () => {}, {matchConstructor: Error}),
            ).toEqualTypeOf<void>();
            assertTypeOf(assertThrows(assert, () => {}, {matchMessage: ''})).toEqualTypeOf<void>();
            assertTypeOf(
                assertThrows(assert, () => {}, {matchConstructor: Error, matchMessage: ''}),
            ).toEqualTypeOf<void>();
        }
    });

    it('is asynchronous if callback is asynchronous with a message', async () => {
        // don't actually run this function, it's just for type testing
        function testTypes() {
            assertTypeOf(assertThrows(assert, async () => {}, {}, 'yo')).toEqualTypeOf<
                Promise<void>
            >();
            assertTypeOf(assertThrows(assert, async () => {}, undefined, 'yo')).toEqualTypeOf<
                Promise<void>
            >();
            assertTypeOf(
                assertThrows(assert, async () => {}, {matchConstructor: Error}, 'yo'),
            ).toEqualTypeOf<Promise<void>>();
            assertTypeOf(
                assertThrows(assert, async () => {}, {matchMessage: ''}, 'yo'),
            ).toEqualTypeOf<Promise<void>>();
            assertTypeOf(
                assertThrows(
                    assert,
                    async () => {},
                    {matchConstructor: Error, matchMessage: ''},
                    'yo',
                ),
            ).toEqualTypeOf<Promise<void>>();
        }
    });

    it('is asynchronous if callback is asynchronous without a message', async () => {
        // don't actually run this function, it's just for type testing
        function testTypes() {
            assertTypeOf(assertThrows(assert, async () => {})).toEqualTypeOf<Promise<void>>();
            assertTypeOf(
                assertThrows(assert, async () => {}, {matchConstructor: Error}),
            ).toEqualTypeOf<Promise<void>>();
            assertTypeOf(assertThrows(assert, async () => {}, {matchMessage: ''})).toEqualTypeOf<
                Promise<void>
            >();
            assertTypeOf(
                assertThrows(assert, async () => {}, {matchConstructor: Error, matchMessage: ''}),
            ).toEqualTypeOf<Promise<void>>();
        }
    });

    it('errors if no error is caught', () => {
        let caughtError: unknown = undefined;
        try {
            assertThrows(assert, () => {});
        } catch (error) {
            caughtError = error;
        }

        assert.isDefined(caughtError);
    });

    it('errors if no error is caught from an async callback', async () => {
        let caughtError: unknown = undefined;
        try {
            await assertThrows(assert, async () => {});
        } catch (error) {
            caughtError = error;
        }

        assert.isDefined(caughtError);
    });

    it('passes if an error is caught', () => {
        assertThrows(assert, () => {
            throw new Error();
        });
    });

    it('passes if an error is caught from an async callback', async () => {
        await assertThrows(assert, async () => {
            throw new Error();
        });
    });

    it('passes with matching options', () => {
        assertThrows(
            assert,
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
                assert,
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
