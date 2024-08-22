import type {CompleteRequire} from './required-keys.js';

export type Values<T> = CompleteRequire<T>[keyof T];
export type ValueAtRequiredKey<Parent, Key extends keyof Parent> = CompleteRequire<Parent>[Key];
