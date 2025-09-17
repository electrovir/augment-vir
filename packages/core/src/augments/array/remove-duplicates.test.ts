import {describe, itCases} from '@augment-vir/test';
import {removeDuplicates} from './remove-duplicates.js';

describe(removeDuplicates.name, () => {
    const exampleObjects: Readonly<Record<number, unknown>> = {
        4: {key: 'value'},
        61: {key: 'value'},
    };

    itCases(removeDuplicates<any>, [
        {
            it: 'removes nothing when no duplicates',
            inputs: [
                [
                    {id: 4},
                    {id: 6},
                    {id: 61},
                    {id: 62},
                    {id: 63},
                ],
                (entry) => entry.id,
            ],
            expect: [
                {id: 4},
                {id: 6},
                {id: 61},
                {id: 62},
                {id: 63},
            ],
        },
        {
            it: 'removes duplicates',
            inputs: [
                [
                    {id: 4},
                    {id: 4},
                    {id: 6},
                    {id: 6},
                    {id: 61},
                    {id: 61},
                    {id: 62},
                    {id: 63},
                ],
                (entry) => entry.id,
            ],
            expect: [
                {id: 4},
                {id: 6},
                {id: 61},
                {id: 62},
                {id: 63},
            ],
        },
        {
            it: 'removes duplicates by a non primitive',
            inputs: [
                [
                    {id: 4},
                    {id: 4},
                    {id: 6},
                    {id: 61},
                    {id: 61},
                    {id: 62},
                    {id: 63},
                ],
                (entry) => exampleObjects[entry.id],
            ],
            expect: [
                {id: 4},
                {id: 6},
                {id: 61},
            ],
        },
        {
            it: 'defaults to using the entry itself, without duplicates',
            inputs: [
                [
                    4,
                    6,
                    61,
                    62,
                    63,
                ],
            ],
            expect: [
                4,
                6,
                61,
                62,
                63,
            ],
        },
        {
            it: 'defaults to using the entry itself, with duplicates',
            inputs: [
                [
                    4,
                    6,
                    61,
                    63,
                    62,
                    6,
                    63,
                ],
            ],
            expect: [
                4,
                6,
                61,
                63,
                62,
            ],
        },
    ]);
});
