import {createAssertWrapGroup} from '../guard-types/assert-wrap-function.js';
import {assertWrapOverrides, extendableAssertions} from './extendable-assertions.js';

export const assertWrap = createAssertWrapGroup(extendableAssertions, assertWrapOverrides);

export type AssertWrap = typeof assertWrap;
