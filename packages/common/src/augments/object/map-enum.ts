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
): EnumMap<Enum, Value>;
export function mapEnumToObject<const Enum extends EnumBaseType, const Value>(
    enumInput: Enum,
    callback: (enumValue: Values<Enum>, wholeEnum: Enum) => MaybePromise<Value>,
): MaybePromise<EnumMap<Enum, Value>>;
export function mapEnumToObject<const Enum extends EnumBaseType, const Value>(
    enumInput: Enum,
    callback: (enumValue: Values<Enum>, wholeEnum: Enum) => MaybePromise<Value>,
): MaybePromise<EnumMap<Enum, Value>> {
    return mapObject(enumInput, (enumKey, enumValue) => {
        return {
            key: enumValue as PropertyKey,
            value: callback(enumValue, enumInput),
        };
    }) as MaybePromise<EnumMap<Enum, Value>>;
}
