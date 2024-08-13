import {CompleteRequire} from './complete-require.js';

export type Values<T> = T[keyof T];
export type ValueAtRequiredKey<Parent, Key extends keyof Parent> = CompleteRequire<Parent>[Key];
