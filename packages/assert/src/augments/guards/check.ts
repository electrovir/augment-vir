import {createCheckGroup} from '../../guard-types/check-function.js';
import {checkOverrides, extendableAssertions} from './extendable-assertions.js';

export const check = createCheckGroup(extendableAssertions, checkOverrides);

export type Check = typeof check;
