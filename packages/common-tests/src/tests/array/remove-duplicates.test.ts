import {itCases} from '@augment-vir/chai';
import {removeDuplicates} from '@augment-vir/common';

describe(removeDuplicates.name, () => {
    const exampleObjects: Readonly<Record<number, unknown>> = {
        4: {key: 'value'},
        61: {key: 'value'},
    };

    itCases(removeDuplicates<any, any>, [
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
    ]);
});
