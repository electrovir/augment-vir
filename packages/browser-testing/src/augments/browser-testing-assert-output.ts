import {
    assertOutput as generic_assertOutput,
    assertOutputWithDescription as generic_assertOutputWithDescription,
} from '@augment-vir/testing';
import {assert} from '@open-wc/testing';

export const assertOutputWithDescription = generic_assertOutputWithDescription.bind(null, assert);

export const assertOutput = generic_assertOutput.bind(null, assert);
