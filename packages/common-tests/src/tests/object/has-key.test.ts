import {itCases} from '@augment-vir/chai';
import {randomInteger, randomString} from '@augment-vir/node-js';
import {hasKey} from '../../../../common/src';

describe(hasKey.name, () => {
    const exampleSymbol = Symbol('example');
    const randomStringKey = randomString();
    const randomNumberKey = randomInteger({max: 100, min: 0});

    itCases(hasKey, [
        {
            it: 'passes with a string prop on an object',
            inputs: [
                {[randomStringKey]: 0},
                randomStringKey,
            ],
            expect: true,
        },
        {
            it: 'passes with a symbol prop on an object',
            inputs: [
                {[exampleSymbol]: 0},
                exampleSymbol,
            ],
            expect: true,
        },
        {
            it: 'passes with a numeric prop on an object',
            inputs: [
                {[randomNumberKey]: 0},
                randomNumberKey,
            ],
            expect: true,
        },
        {
            it: 'passes with a prop from a function',
            inputs: [
                () => {},
                'name',
            ],
            expect: true,
        },
        {
            it: 'fails with a string key that does not exists in a function',
            inputs: [
                () => {},
                randomStringKey,
            ],
            expect: false,
        },
        {
            it: 'fails with a string key that does not exists in a object',
            inputs: [
                {},
                randomStringKey,
            ],
            expect: false,
        },
        {
            it: 'fails with a numeric key that does not exists in a object',
            inputs: [
                {},
                randomNumberKey,
            ],
            expect: false,
        },
        {
            it: 'fails with a symbol key that does not exists in a object',
            inputs: [
                {},
                exampleSymbol,
            ],
            expect: false,
        },
    ]);
});
