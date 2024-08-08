/* eslint-disable @typescript-eslint/ban-ts-comment */
import {assert, describe} from '@augment-vir/test';
import {ensureType} from './ensure-type.js';

describe(ensureType.name, ({it}) => {
    const placeholder = {
        what: 'nothing',
        just: 'make sure no mutations happened',
        inFact: 'the object reference should remain as well',
    } as const;

    it('should not actually mutate or change its input', () => {
        const output = ensureType<typeof placeholder>(placeholder);

        assert.strictEqual(output, placeholder, 'object references should not have changed');
        assert.deepStrictEqual(output, placeholder, 'object internals should not have changed');
    });

    it('should enforce type safety', () => {
        // @ts-expect-error
        ensureType<string>(5);
        ensureType<string>('5');
        // @ts-expect-error
        ensureType<{who: number}>({what: 5});
        ensureType<{who: number}>({who: 5});
        ensureType<{who?: number}>({});
        // @ts-expect-error
        const wrongAssignment: number = ensureType<string>('actually a string');
        const correctAssignment: number = ensureType<number>(5);

        // @ts-expect-error
        const errorIfNoGeneric: unknown = ensureType(placeholder);
    });
});
