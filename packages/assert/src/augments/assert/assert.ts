import {assert as chaiAssert} from 'chai';
import {assertTypeOf} from './assert-type-of.js';

const extraAssertions = {
    typeOf: assertTypeOf,
};

export const assert: typeof chaiAssert & typeof extraAssertions = chaiAssert as any;
Object.assign(assert, extraAssertions);
