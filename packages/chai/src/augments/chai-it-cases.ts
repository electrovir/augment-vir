import {itCases as generic_itCases} from '@augment-vir/testing';
import {assert} from 'chai';

export const itCases = generic_itCases.bind(null, {assert, it, forceIt: it.only});
