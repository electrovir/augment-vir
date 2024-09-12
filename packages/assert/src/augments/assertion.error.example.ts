import {AssertionError} from '@augment-vir/assert';

// the message from this error will be: `'User defined message: The assertion failed.'`
throw new AssertionError('The assertion failed.', 'User defined message.');
