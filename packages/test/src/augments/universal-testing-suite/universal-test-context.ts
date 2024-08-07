import {VirEnv} from '@augment-vir/env';
import {Context as MochaContext} from 'mocha';
import {TestContext as NodeTestContext} from 'node:test';
import {OmitIndexSignature, Simplify} from 'type-fest';

export type UniversalContext = NodeTestContext | MochaContext;

export type ContextByEnv = {
    [VirEnv.Node]: NodeTestContext;
    [VirEnv.Web]: MochaContext;
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
    Simplify<keyof OmitIndexSignature<MochaContext>>
>;

const nodeOnlyCheckKey = 'diagnostic' satisfies NodeOnlyTestContextKeys;

export function determineTestContextVirEnv(context: UniversalContext): VirEnv {
    return context[nodeOnlyCheckKey] ? VirEnv.Node : VirEnv.Web;
}
