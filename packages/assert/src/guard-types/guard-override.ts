import {AnyObject, Values} from '@augment-vir/core';

export const autoGuardSymbol = Symbol('auto guard');

export function autoGuard<T>(): T {
    return autoGuardSymbol as T;
}

export function pickOverride<Overrides extends AnyObject, Created>(
    overrides: Overrides,
    name: string,
    create: () => Created,
): Values<Overrides> | Created {
    if (name in overrides && overrides[name] !== autoGuardSymbol) {
        return overrides[name];
    }
    return create();
}
