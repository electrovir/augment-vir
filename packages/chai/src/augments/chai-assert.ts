import {expectDuration as generic_expectDuration} from '@augment-vir/testing';
import {expect} from 'chai';

export function expectDuration(callback: (() => void) | (() => PromiseLike<void>)) {
    return generic_expectDuration(expect, callback);
}
