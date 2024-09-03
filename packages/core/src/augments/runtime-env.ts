import {isNode} from 'browser-or-node';

/**
 * JavaScript runtime env.
 *
 * @category Env
 * @package @augment-vir/common
 */
export enum RuntimeEnv {
    Node = 'node',
    Web = 'web',
}

/**
 * Determine the current {@link RuntimeEnv} value. Usually you shouldn't need to call this, you can
 * simply import {@link currentRuntimeEnv} directly.
 *
 * @category Env
 * @package @augment-vir/common
 */
export function determineRuntimeEnv(): RuntimeEnv {
    /** Coverage in this package is only run in Node. */
    /* node:coverage ignore next */
    return isNode ? RuntimeEnv.Node : RuntimeEnv.Web;
}

/**
 * The current {@link RuntimeEnv}.
 *
 * @category Env
 * @package @augment-vir/common
 */
export const currentRuntimeEnv = determineRuntimeEnv();

/**
 * Checks if the given {@link RuntimeEnv} value is the current {@link RuntimeEnv} value.
 *
 * @category Env
 * @returns `true` if the given {@link RuntimeEnv} is the current {@link RuntimeEnv}.
 * @package @augment-vir/common
 */
export function isRuntimeEnv(itItThisEnv: RuntimeEnv): boolean {
    return currentRuntimeEnv === itItThisEnv;
}

/**
 * Throw this Error to indicate that something was attempted that cannot be done in the current
 * runtime.
 *
 * @category Env
 * @package @augment-vir/common
 */
export class RuntimeEnvError extends Error {
    public override readonly name = 'RuntimeEnvError';
}

/**
 * Requires defining an object of functions for all possible {@link RuntimeEnv} values and then only
 * calls the function for the current runtime.
 *
 * @category Env
 * @package @augment-vir/common
 */
export function perEnv<T>(perEnv: Record<RuntimeEnv, () => T>): T {
    return perEnv[currentRuntimeEnv]();
}
