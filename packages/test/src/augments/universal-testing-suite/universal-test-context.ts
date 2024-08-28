import {RuntimeEnv} from '@augment-vir/core';
import {TestContext as NodeTestContextImport} from 'node:test';
import {OmitIndexSignature, Simplify} from 'type-fest';
import type {MochaContext} from '../../mocha-types.js';

export type MochaTestContext = MochaContext;
export type NodeTestContext = NodeTestContextImport;

export type UniversalContext = NodeTestContext | MochaTestContext;

export type ContextByEnv = {
    [RuntimeEnv.Node]: NodeTestContext;
    [RuntimeEnv.Web]: MochaContext;
};

export function ensureTestContext<const SpecificEnv extends RuntimeEnv>(
    context: UniversalContext,
    env: RuntimeEnv,
): ContextByEnv[SpecificEnv] {
    assertTestContext(context, env);

    return context as ContextByEnv[SpecificEnv];
}
export function assertTestContext<const SpecificEnv extends RuntimeEnv>(
    context: UniversalContext,
    env: RuntimeEnv,
): asserts context is ContextByEnv[SpecificEnv] {
    const actualEnv = determineTestContextEnv(context);

    if (actualEnv !== env) {
        throw new TypeError();
    }
}

export function isTestContext<const SpecificEnv extends RuntimeEnv>(
    context: UniversalContext,
    env: RuntimeEnv,
): context is ContextByEnv[SpecificEnv] {
    try {
        assertTestContext(context, env);
        return true;
    } catch {
        return false;
    }
}

type NodeOnlyTestContextKeys = Exclude<
    Simplify<keyof NodeTestContext>,
    Simplify<keyof OmitIndexSignature<MochaTestContext>>
>;

const nodeOnlyCheckKey = 'diagnostic' satisfies NodeOnlyTestContextKeys;

export function determineTestContextEnv(context: UniversalContext): RuntimeEnv {
    return context[nodeOnlyCheckKey] ? RuntimeEnv.Node : RuntimeEnv.Web;
}
