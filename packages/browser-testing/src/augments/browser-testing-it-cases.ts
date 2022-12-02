import {itCases as generic_itCases} from '@augment-vir/testing';
import {assert} from '@open-wc/testing';

export const itCases = generic_itCases.bind(null, {assert, it, forceIt: it.only});
