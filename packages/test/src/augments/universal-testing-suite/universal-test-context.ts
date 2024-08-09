import {VirEnv} from '@augment-vir/env';
import {TestContext as NodeTestContextImport} from 'node:test';
import {OmitIndexSignature, Simplify} from 'type-fest';
import type {Mocha} from '../../mocha.js';

export type MochaTestContext = Mocha.Context;
export type NodeTestContext = NodeTestContextImport;

export type UniversalContext = NodeTestContext | MochaTestContext;

export type ContextByEnv = {
    [VirEnv.Node]: NodeTestContext;
    [VirEnv.Web]: Mocha.Context;
};

export function ensureTestContext<const SpecificEnv extends VirEnv>(
    context: UniversalContext,
    env: VirEnv,
): ContextByEnv[SpecificEnv] {
    assertTestContext(context, env);

    return context as ContextByEnv[SpecificEnv];
}
export function assertTestContext<const SpecificEnv extends VirEnv>(
    context: UniversalContext,
    env: VirEnv,
): asserts context is ContextByEnv[SpecificEnv] {
    const actualEnv = determineTestContextVirEnv(context);

    if (actualEnv !== env) {
        throw new TypeError();
    }
}

export function isTestContext<const SpecificEnv extends VirEnv>(
    context: UniversalContext,
    env: VirEnv,
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

export function determineTestContextVirEnv(context: UniversalContext): VirEnv {
    return context[nodeOnlyCheckKey] ? VirEnv.Node : VirEnv.Web;
}
