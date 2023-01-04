import {assertTypeOf} from '@augment-vir/chai';
import {describe} from 'mocha';
import {getValueFromNestedKeys, NestedSequentialKeys} from '../../../common/src';
import {NestedKeys} from '../../../common/src/augments/nested-keys';

type ExampleObjectType = {
    topLevel: string;
    oneLevelDeep: {
        singleNestedProp: number;
    };
    threeLevelsDeep: {
        nestedOne: {
            nestedTwo: {
                nestedThree: {
                    propOne: RegExp;
                    propTwo: Date;
                };
            };
        };
    };
};

describe('NestedKeys', () => {
    it('should restrict types', () => {
        const exampleObjectInstance: NestedSequentialKeys<ExampleObjectType> = {} as any;

        assertTypeOf<[]>().not.toBeAssignableTo(exampleObjectInstance);
        assertTypeOf<['topLevel']>().toBeAssignableTo(exampleObjectInstance);
        assertTypeOf<['oneLevelDeep']>().toBeAssignableTo(exampleObjectInstance);
        assertTypeOf<['oneLevelDeep', 'oneLevelDeep']>().not.toBeAssignableTo<
            NestedSequentialKeys<ExampleObjectType>
        >();
        assertTypeOf<['oneLevelDeep', 'topLevel']>().not.toBeAssignableTo<
            NestedSequentialKeys<ExampleObjectType>
        >();
        assertTypeOf<['oneLevelDeep', 'singleNestedProp']>().toBeAssignableTo<
            NestedSequentialKeys<ExampleObjectType>
        >();

        assertTypeOf<['oneLevelDeep', 'nestedOne']>().not.toBeAssignableTo<
            NestedSequentialKeys<ExampleObjectType>
        >();
        assertTypeOf<['threeLevelsDeep']>().toBeAssignableTo(exampleObjectInstance);
        assertTypeOf<['threeLevelsDeep', 'nestedOne']>().toBeAssignableTo<
            NestedSequentialKeys<ExampleObjectType>
        >();
        assertTypeOf<['threeLevelsDeep', 'nestedTwo']>().not.toBeAssignableTo<
            NestedSequentialKeys<ExampleObjectType>
        >();
        assertTypeOf<
            ['threeLevelsDeep', 'nestedOne', 'nestedTwo', 'nestedThree', 'propOne']
        >().toBeAssignableTo(exampleObjectInstance);
        assertTypeOf<
            ['threeLevelsDeep', 'nestedOne', 'nestedTwo', 'nestedThree', 'propTwo']
        >().toBeAssignableTo(exampleObjectInstance);
        assertTypeOf<
            ['threeLevelsDeep', 'nestedOne', 'nestedTwo', 'nestedThree', 'derp']
        >().not.toBeAssignableTo(exampleObjectInstance);
        assertTypeOf<
            ['threeLevelsDeep', 'singleNestedProp', 'nestedTwo', 'nestedThree']
        >().not.toBeAssignableTo(exampleObjectInstance);
    });
});

describe('NestedAnyKeys', () => {
    it('should allow unions', () => {
        assertTypeOf<ExampleObjectType['topLevel' | 'oneLevelDeep']>().toEqualTypeOf<
            string | ExampleObjectType['oneLevelDeep']
        >();

        assertTypeOf<['topLevel' | 'threeLevelsDeep']>().toBeAssignableTo<
            NestedKeys<ExampleObjectType>
        >();

        assertTypeOf<['oneLevelDeep' | 'threeLevelsDeep', 'nestedOne']>().toBeAssignableTo<
            NestedKeys<ExampleObjectType>
        >();
    });
});

describe('getValueFromNestedKeys', () => {
    it('should restrict types properly', () => {
        const example: ExampleObjectType = {} as any;

        assertTypeOf(getValueFromNestedKeys(example, ['topLevel'])).toEqualTypeOf<
            string | undefined
        >();

        const derp: NestedSequentialKeys<ExampleObjectType> = ['topLevel'];

        assertTypeOf<['topLevel']>().toBeAssignableTo<NestedSequentialKeys<ExampleObjectType>>();

        assertTypeOf<['']>().not.toBeAssignableTo<NestedSequentialKeys<ExampleObjectType>>();

        getValueFromNestedKeys(example, [
            // @ts-expect-error
            '',
        ]);

        assertTypeOf(
            getValueFromNestedKeys(example, [
                'threeLevelsDeep',
                'nestedOne',
                'nestedTwo',
                'nestedThree',
                'propTwo',
            ]),
        ).toEqualTypeOf<Date | undefined>();
    });
});
