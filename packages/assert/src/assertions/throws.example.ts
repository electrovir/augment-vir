import {assert, type ErrorMatchOptions} from '@augment-vir/assert';

// define the options
const matchOptions: ErrorMatchOptions = {
    matchConstructor: Error,
    matchMessage: 'some error',
};

assert.throws(
    () => {
        throw new Error('some error');
    },
    // use the options
    matchOptions,
); // this assertion will pass
