import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

/** Chai augments only */
export * from './augments/chai-only/chai';

chai.use(chaiAsPromised);
