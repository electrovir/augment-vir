import {AnyObject} from './object/generic-object-type.js';

export type PartialWithNullable<T extends AnyObject> = {
    [Prop in keyof T]?: T[Prop] | null | undefined;
};

export type PartialWithUndefined<T extends AnyObject> = {
    [Prop in keyof T]?: T[Prop] | undefined;
};
