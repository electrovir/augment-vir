import {itSnapshots} from './it-snapshots';

describe(itSnapshots.name, () => {
    it('should have correct types', () => {
        // @ts-expect-error the test function must return something
        itSnapshots(() => {}, [] as any[]);
        itSnapshots(
            () => {
                return 5;
            },
            'group key',
            [
                {
                    it: 'should do a thing',
                },
            ],
        );
    });
});
