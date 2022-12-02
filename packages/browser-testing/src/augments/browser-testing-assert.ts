import {
    expectDuration as generic_expectDuration,
    typedAssertInstanceOf as generic_typedAssertInstanceOf,
    typedAssertNotNullish as generic_typedAssertNotNullish,
} from '@augment-vir/testing';
import {assert, expect} from '@open-wc/testing';
import {Constructor} from 'type-fest';

export function typedAssertInstanceOf<T>(
    input: unknown,
    classConstructor: Constructor<T>,
): asserts input is T {
    return generic_typedAssertInstanceOf(assert, input, classConstructor);
}

export function typedAssertNotNullish<T>(input: T): asserts input is NonNullable<T> {
    return generic_typedAssertNotNullish(assert, input);
}

export function expectDuration<ExpectGeneric extends (value: any) => any>(
    callback: (() => void) | (() => PromiseLike<void>),
): Promise<ReturnType<ExpectGeneric>> | ReturnType<ExpectGeneric> {
    return generic_expectDuration(expect, callback) as
        | Promise<ReturnType<ExpectGeneric>>
        | ReturnType<ExpectGeneric>;
}
