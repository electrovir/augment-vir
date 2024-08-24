import type {EnumBaseType, MaybePromise, Values} from '@augment-vir/core';
import {mapObject} from './map-entries.js';

export type EnumMap<Enum extends EnumBaseType, Value> =
    Values<Enum> extends PropertyKey ? Record<Values<Enum>, Value> : 'ERROR: invalid enum';

export function mapEnumToObject<const Enum extends EnumBaseType, const Value>(
    enumInput: Enum,
    callback: (enumValue: Values<Enum>) => Promise<Value>,
): Promise<EnumMap<Enum, Value>>;
export function mapEnumToObject<const Enum extends EnumBaseType, const Value>(
    enumInput: Enum,
    callback: (enumValue: Values<Enum>, wholeEnum: Enum) => Value,
): Value extends Promise<any>
    ? Promise<any> extends Value
        ? Promise<EnumMap<Enum, Awaited<Value>>>
        : MaybePromise<EnumMap<Enum, Awaited<Value>>>
    : EnumMap<Enum, Value>;
export function mapEnumToObject<const Enum extends EnumBaseType, const Value>(
    enumInput: Enum,
    callback: (enumValue: Values<Enum>, wholeEnum: Enum) => MaybePromise<Value>,
): MaybePromise<EnumMap<Enum, Value>> {
    return mapObject(enumInput, (enumKey, enumValue) => {
        const key = enumValue as PropertyKey;
        const value = callback(enumValue, enumInput);

        if (value instanceof Promise) {
            return value.then((resolvedValue) => {
                return {
                    key,
                    value: resolvedValue,
                };
            });
        } else {
            return {
                key,
                value,
            };
        }
    }) as MaybePromise<EnumMap<Enum, Value>>;
}
