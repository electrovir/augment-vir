import {describe, it} from '@augment-vir/test';
import type {GuardGroup} from './guard-group.js';

describe('GuardGroup', () => {
    it('requires assertions', () => {
        // @ts-expect-error: missing assertions property
        const example = {} satisfies GuardGroup<typeof assertions>;
        const example2 = {assert: {}} satisfies GuardGroup<typeof assertions>;
    });
});
