import type {AssertFunction} from './assert-function.js';
import type {AssertWrapOverridesBase} from './assert-wrap-function.js';
import type {CheckOverridesBase} from './check-function.js';
import type {WaitUntilOverridesBase} from './wait-until-function.js';

export type GuardGroup = {
    assertions: Record<string, AssertFunction<any>>;
} & Partial<{
    checkOverrides: CheckOverridesBase;
    assertWrapOverrides: AssertWrapOverridesBase;
    checkWrapOverrides: AssertWrapOverridesBase;
    waitUntilOverrides: WaitUntilOverridesBase;
}>;
