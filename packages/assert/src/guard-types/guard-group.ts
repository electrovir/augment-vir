/* node:coverage disable */
/** C8 fails in type-only files. */

import type {AssertFunction} from './assert-function.js';
import type {AssertWrapOverridesBase} from './assert-wrap-function.js';
import type {CheckOverridesBase} from './check-function.js';
import type {WaitUntilOverridesBase} from './wait-until-function.js';

export type GuardGroup<Assertions extends Record<string, AssertFunction<any>>> = {
    assert: Assertions;
    check: CheckOverridesBase<keyof Assertions>;
    assertWrap: AssertWrapOverridesBase<keyof Assertions>;
    checkWrap: AssertWrapOverridesBase<keyof Assertions>;
    waitUntil: WaitUntilOverridesBase<keyof Assertions>;
};
