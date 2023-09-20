import {expectDuration as generic_expectDuration} from '@augment-vir/testing';
import {expect} from '@open-wc/testing';

export function expectDuration(callback: (() => void) | (() => PromiseLike<void>)) {
    return generic_expectDuration(expect, callback);
}
