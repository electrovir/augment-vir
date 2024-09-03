import {describe, it} from '@augment-vir/test';
import type {GuardGroup} from './guard-group.js';

describe('GuardGroup', () => {
    it('requires assertions', () => {
        // @ts-expect-error: missing properties
        const example1 = {assert: {}} satisfies GuardGroup<typeof assertions>;

        const assertions = {
            hi() {},
        };

        const example2 = {
            assert: {
                hi() {},
            },
            check: {
                hi(): boolean {
                    return false;
                },
            },
            assertWrap: {
                hi() {},
            },
            checkWrap: {
                hi() {},
            },
            waitUntil: {
                hi() {},
            },
        } satisfies GuardGroup<typeof assertions>;

        const example3 = {
            assert: {
                // @ts-expect-error: must be a function
                hi: 'hi',
            },
            check: {
                // @ts-expect-error: must be a function
                hi: 'hi',
            },
            assertWrap: {
                // @ts-expect-error: must be a function
                hi: 'hi',
            },
            checkWrap: {
                // @ts-expect-error: must be a function
                hi: 'hi',
            },
            waitUntil: {
                // @ts-expect-error: must be a function
                hi: 'hi',
            },
        } satisfies GuardGroup<typeof assertions>;
    });
});
