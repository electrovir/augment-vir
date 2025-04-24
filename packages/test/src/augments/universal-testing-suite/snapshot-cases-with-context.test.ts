import {snapshotCasesWithContext} from './snapshot-cases-with-context.js';
import {describe} from './universal-describe.js';
import {it} from './universal-it.js';
import {type UniversalTestContext} from './universal-test-context.js';

describe(snapshotCasesWithContext.name, () => {
    it('has proper types', () => {
        /** Don't run this function, it's just here for testing types. */
        () => {
            function acceptContext(testContext: UniversalTestContext, something: string) {}
            function onlyAcceptsContext(testContext: UniversalTestContext) {}
            function doesNotAcceptContext(something: string) {}

            snapshotCasesWithContext(acceptContext, [
                {
                    it: 'test',
                    input: '',
                },
            ]);
            snapshotCasesWithContext(onlyAcceptsContext, [
                {
                    it: 'test',
                },
            ]);
            // @ts-expect-error: this function does not accept test context as the first parameter
            snapshotCasesWithContext(doesNotAcceptContext, []);
        };
    });
});
