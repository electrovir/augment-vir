import type {MaybePromise} from '@augment-vir/common';

export function dockerTest(callback: () => MaybePromise<void>) {
    return callback;
}
