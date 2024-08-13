import {ExtractKeysWithMatchingValues, Overwrite} from '@augment-vir/core';
import {NarrowToExpected} from '../assertions/narrow-type.js';
import {AssertFunction} from './assert-function.js';
import {AssertWrapOverridesBase} from './assert-wrap-function.js';
import {pickOverride} from './guard-override.js';

export type CheckWrapFunction<Output> = <Input>(
    input: Input,
    ...extraInputs: any[]
) => NarrowToExpected<Input, Output> | undefined;

export type CheckWrapGroup<
    Asserts extends Readonly<Record<string, AssertFunction<any>>>,
    CheckWrapOverrides extends AssertWrapOverridesBase,
> = Omit<
    Overwrite<
        {
            [Name in keyof Asserts as Asserts[Name] extends AssertFunction<any>
                ? Name
                : never]: Asserts[Name] extends AssertFunction<infer Output>
                ? CheckWrapFunction<Output>
                : never;
        },
        CheckWrapOverrides
    >,
    ExtractKeysWithMatchingValues<CheckWrapOverrides, undefined>
>;

export function createCheckWrapGroup<
    const Asserts extends Readonly<Record<string, AssertFunction<any>>>,
    const CheckWrapOverrides extends AssertWrapOverridesBase,
>(asserts: Asserts, checkWrapOverrides: CheckWrapOverrides) {
    const checks = Object.entries(asserts).reduce(
        (
            accum,
            [
                name,
                assert,
            ],
        ) => {
            accum[name] = pickOverride(checkWrapOverrides, name, () =>
                createCheckWrap(assert),
            ) as any;
            return accum;
        },
        {} as Record<string, CheckWrapFunction<any>>,
    );

    return checks as CheckWrapGroup<Asserts, CheckWrapOverrides>;
}

export function createCheckWrap<const Output>(assert: AssertFunction<Output>) {
    return ((...inputs) => {
        try {
            assert(...inputs);
            return inputs[0];
        } catch {
            return undefined;
        }
    }) as CheckWrapFunction<Output>;
}
