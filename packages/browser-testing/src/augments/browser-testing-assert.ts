import {
    expectDuration as generic_expectDuration,
    typedAssertInstanceOf as generic_typedAssertInstanceOf,
    typedAssertNotNullish as generic_typedAssertNotNullish,
} from '@augment-vir/testing';
import {assert, expect} from '@open-wc/testing';
import type {} from 'type-fest';
export type {} from 'type-fest';

export const typedAssertInstanceOf = generic_typedAssertInstanceOf.bind(null, assert);

export const typedAssertNotNullish = generic_typedAssertNotNullish.bind(null, assert);

export const expectDuration = generic_expectDuration.bind(null, expect);
