import {createWaitUntilGroup} from '../../guard-types/wait-until-function.js';
import {extendableAssertions, waitUntilOverrides} from './extendable-assertions.js';

export const waitUntil = createWaitUntilGroup(extendableAssertions, waitUntilOverrides);

export type WaitUntil = typeof waitUntil;
