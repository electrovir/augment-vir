import {
    expectDuration as generic_expectDuration,
    typedAssertInstanceOf as generic_typedAssertInstanceOf,
    typedAssertNotNullish as generic_typedAssertNotNullish,
} from '@augment-vir/testing';
import {assert, expect} from 'chai';
import {Constructor} from 'type-fest';

export function typedAssertInstanceOf<T>(
    input: unknown,
    classConstructor: Constructor<T>,
    message?: string | undefined,
): asserts input is T {
    return generic_typedAssertInstanceOf(assert, input, classConstructor, message);
}

export function typedAssertNotNullish<T>(
    input: T,
    message?: string | undefined,
): asserts input is NonNullable<T> {
    return generic_typedAssertNotNullish(assert, input, message);
}

export function expectDuration(callback: (() => void) | (() => PromiseLike<void>)) {
    return generic_expectDuration(expect, callback);
}
