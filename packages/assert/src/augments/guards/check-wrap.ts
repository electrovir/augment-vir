import {createCheckWrapGroup} from '../../guard-types/check-wrap-wrapper-function.js';
import {checkWrapOverrides, extendableAssertions} from './extendable-assertions.js';

export const checkWrap = createCheckWrapGroup(extendableAssertions, checkWrapOverrides);

export type CheckWrap = typeof checkWrap;
