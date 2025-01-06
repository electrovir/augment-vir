import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {ArrayElement} from '../array/array.js';
import {
    ErrorHttpStatusCategories,
    HttpStatus,
    httpStatusByCategory,
    isErrorHttpStatus,
    SuccessHttpStatusCategories,
} from './http-status.js';

describe(isErrorHttpStatus.name, () => {
    itCases(isErrorHttpStatus, [
        {
            it: 'passes a client error',
            input: HttpStatus.BadRequest,
            expect: true,
        },
        {
            it: 'passes a server error',
            input: HttpStatus.InternalServerError,
            expect: true,
        },
        {
            it: 'rejects an info status',
            input: HttpStatus.Continue,
            expect: false,
        },
        {
            it: 'rejects a redirect',
            input: HttpStatus.MultipleChoices,
            expect: false,
        },
        {
            it: 'rejects a success',
            input: HttpStatus.Ok,
            expect: false,
        },
    ]);
    it('type guards the input', () => {
        const status: HttpStatus = HttpStatus.Accepted as HttpStatus;

        if (isErrorHttpStatus(status)) {
            assert
                .tsType(status)
                .equals<ArrayElement<(typeof httpStatusByCategory)[ErrorHttpStatusCategories]>>();
        } else {
            assert
                .tsType(status)
                .equals<ArrayElement<(typeof httpStatusByCategory)[SuccessHttpStatusCategories]>>();
        }
    });
});
