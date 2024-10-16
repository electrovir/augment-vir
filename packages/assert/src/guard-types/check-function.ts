import type {
    ExtractKeysWithMatchingValues,
    MaybePromise,
    Overwrite,
    RemoveFirstTupleEntry,
    RemoveLastTupleEntry,
} from '@augment-vir/core';
import {type AssertFunction} from './assert-function.js';
import {pickOverride, type autoGuardSymbol} from './guard-override.js';

export type CheckFunction<Output> = (input: any, ...extraInputs: any[]) => input is Output;
export type GenericCheckFunction = (
    input: any,
    ...extraInputs: any[]
) => MaybePromise<boolean> | never;

export type CheckOverridesBase<Keys extends PropertyKey = string> = Readonly<
    Record<Keys, CheckFunction<any> | GenericCheckFunction | undefined | typeof autoGuardSymbol>
>;

export type CheckGroup<
    Asserts extends Readonly<Record<string, AssertFunction<any>>>,
    CheckOverrides extends CheckOverridesBase,
> = Omit<
    Overwrite<
        {
            [Name in keyof Asserts as Asserts[Name] extends AssertFunction<any>
                ? Name
                : never]: Asserts[Name] extends AssertFunction<infer Output>
                ? (
                      input: Parameters<Asserts[Name]>[0],
                      ...params: RemoveLastTupleEntry<
                          RemoveFirstTupleEntry<Parameters<Asserts[Name]>>
                      >
                  ) => input is Output
                : never;
        },
        {
            [Name in keyof CheckOverrides]: CheckOverrides[Name] extends typeof autoGuardSymbol
                ? Name extends keyof Asserts
                    ? Asserts[Name] extends AssertFunction<infer Output>
                        ? (
                              input: Parameters<Asserts[Name]>[0],
                              ...params: RemoveLastTupleEntry<
                                  RemoveFirstTupleEntry<Parameters<Asserts[Name]>>
                              >
                          ) => input is Output
                        : never
                    : never
                : CheckOverrides[Name];
        }
    >,
    ExtractKeysWithMatchingValues<CheckOverrides, undefined>
>;

export function createCheckGroup<
    const Asserts extends Readonly<Record<string, AssertFunction<any>>>,
    const CheckOverrides extends CheckOverridesBase,
>(asserts: Asserts, checkOverrides: CheckOverrides) {
    const checks = Object.entries(asserts).reduce(
        (
            accum,
            [
                name,
                assert,
            ],
        ) => {
            accum[name] = pickOverride(checkOverrides, name, () => createCheck(assert)) as any;
            return accum;
        },
        {} as Record<PropertyKey, CheckFunction<any>>,
    );

    return checks as CheckGroup<Asserts, CheckOverrides>;
}

export function createCheck<const Output>(assert: AssertFunction<Output>) {
    return ((...inputs) => {
        return runAssertCheck(assert, ...inputs);
    }) as CheckFunction<Output>;
}

export function runAssertCheck<const Output, const Assert extends AssertFunction<Output>>(
    assert: Assert,
    input: Parameters<Assert>[0],
    ...inputs: RemoveFirstTupleEntry<RemoveLastTupleEntry<Parameters<Assert>>>
): input is Output {
    try {
        assert(input, ...inputs);
        return true;
    } catch {
        return false;
    }
}
