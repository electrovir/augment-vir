import {
    AnyFunction,
    ExtractKeysWithMatchingValues,
    NarrowToExpected,
    Overwrite,
} from '@augment-vir/core';
import {AssertFunction} from './assert-function.js';
import {autoGuardSymbol, pickOverride} from './guard-override.js';

export type AssertWrapFunction<Output> = <Input>(
    input: Input,
    ...extraInputs: any[]
) => NarrowToExpected<Input, Output>;

export type AssertWrapOverridesBase = Readonly<
    Record<string, AnyFunction | undefined | typeof autoGuardSymbol>
>;

export type AssertWrapGroup<
    Asserts extends Readonly<Record<string, AssertFunction<any>>>,
    AssertWrapOverrides extends AssertWrapOverridesBase,
> = Omit<
    Overwrite<
        {
            [Name in keyof Asserts as Asserts[Name] extends AssertFunction<any>
                ? Name
                : never]: Asserts[Name] extends AssertFunction<infer Output>
                ? AssertWrapFunction<Output>
                : never;
        },
        {
            [Name in keyof AssertWrapOverrides]: AssertWrapOverrides[Name] extends typeof autoGuardSymbol
                ? Name extends keyof Asserts
                    ? Asserts[Name] extends AssertFunction<infer Output>
                        ? AssertWrapFunction<Output>
                        : never
                    : never
                : AssertWrapOverrides[Name];
        }
    >,
    ExtractKeysWithMatchingValues<AssertWrapOverrides, undefined>
>;

export function createAssertWrapGroup<
    const Asserts extends Readonly<Record<string, AssertFunction<any>>>,
    const AssertWrapOverrides extends AssertWrapOverridesBase,
>(asserts: Asserts, assertWrapOverrides: AssertWrapOverrides) {
    const checks = Object.entries(asserts).reduce(
        (
            accum,
            [
                name,
                assert,
            ],
        ) => {
            accum[name] = pickOverride(assertWrapOverrides, name, () =>
                createAssertWrap(assert),
            ) as any;
            return accum;
        },
        {} as Record<string, AssertWrapFunction<any>>,
    );

    return checks as AssertWrapGroup<Asserts, AssertWrapOverrides>;
}

export function createAssertWrap<const Output>(assert: AssertFunction<Output>) {
    return ((...inputs) => {
        assert(...inputs);
        return inputs[0];
    }) as AssertWrapFunction<Output>;
}
