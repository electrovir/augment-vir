import {isNode} from 'browser-or-node';

/**
 * JavaScript runtime env. Named with the "Vir" prefix to help alleviate clashing with application
 * code, which usually has its own env definition as well.
 *
 * @category Env
 */
export enum VirEnv {
    Node = 'node',
    Web = 'web',
}

/**
 * Determine the current {@link VirEnv} value.
 *
 * @category Env
 */
export function determineVirEnv(): VirEnv {
    return isNode ? VirEnv.Node : VirEnv.Web;
}

/**
 * The current {@link VirEnv} value.
 *
 * @category Env
 */
export const virEnv = determineVirEnv();

/**
 * Checks if the given {@link VirEnv} value is the current {@link VirEnv} value.
 *
 * @category Env
 * @returns `true` if the given {@link VirEnv} is the current {@link VirEnv}.
 */
export function isVirEnv(isItThisVirEnv: VirEnv): boolean {
    return virEnv === isItThisVirEnv;
}
