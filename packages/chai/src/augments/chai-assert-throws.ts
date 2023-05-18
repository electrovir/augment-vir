import {MaybePromise} from '@augment-vir/common';
import {ErrorMatchOptions, assertThrows as generic_assertThrows} from '@augment-vir/testing';
import {assert} from 'chai';

export function assertThrows(
    callback: Promise<any>,
    matching?: ErrorMatchOptions | undefined,
    failureMessage?: string,
): Promise<void>;
export function assertThrows(
    callback: () => Promise<any>,
    matching?: ErrorMatchOptions | undefined,
    failureMessage?: string,
): Promise<void>;
export function assertThrows(
    callback: () => any,
    matching?: ErrorMatchOptions | undefined,
    failureMessage?: string,
): void;
export function assertThrows(
    callback: () => MaybePromise<any>,
    matching?: ErrorMatchOptions | undefined,
    failureMessage?: string,
): MaybePromise<void>;
export function assertThrows(
    callback: (() => MaybePromise<any>) | (() => Promise<any>) | (() => any) | Promise<any>,
    matching?: ErrorMatchOptions | undefined,
    failureMessage?: string,
): MaybePromise<void>;
export function assertThrows(
    callback: (() => MaybePromise<any>) | (() => Promise<any>) | (() => any) | Promise<any>,
    matching?: ErrorMatchOptions | undefined,
    failureMessage?: string,
): MaybePromise<void> {
    return generic_assertThrows(assert, callback, matching, failureMessage);
}
