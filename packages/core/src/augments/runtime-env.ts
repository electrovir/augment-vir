import {isNode} from 'browser-or-node';

/**
 * JavaScript run-time env. code, which usually has its own env definition as well.
 *
 * @category Env
 */
export enum RuntimeEnv {
    Node = 'node',
    Web = 'web',
}

/**
 * Determine the current {@link RuntimeEnv} value. Usually you shouldn't need to call this, you can
 * simply import {@link runtimeEnv} directly.
 *
 * @category Env
 */
export function determineRuntimeEnv(): RuntimeEnv {
    return isNode ? RuntimeEnv.Node : RuntimeEnv.Web;
}

/**
 * The current {@link RuntimeEnv} value.
 *
 * @category Env
 */
export const runtimeEnv = determineRuntimeEnv();

/**
 * Checks if the given {@link RuntimeEnv} value is the current {@link RuntimeEnv} value.
 *
 * @category Env
 * @returns `true` if the given {@link RuntimeEnv} is the current {@link RuntimeEnv}.
 */
export function isRuntimeEnv(itItThisEnv: RuntimeEnv): boolean {
    return runtimeEnv === itItThisEnv;
}

export class RuntimeEnvError extends Error {
    public override readonly name = 'RuntimeEnvError';
}
