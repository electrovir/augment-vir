import {PickDeep} from '@augment-vir/common';
import {describe, it} from 'mocha';
import {assertTypeOf} from 'run-time-assertions';

describe('PickDeep', () => {
    type TestObject = {
        topLevel: string;
        topLevelWithNested1: {
            secondLevel1: string;
            secondLevelWithNested11: {
                thirdLevel11: string;
            };
            secondLevelWithNested12: {
                thirdLevel12: string;
            };
        };
        topLevelWithNested2: {
            secondLevel2: string;
            secondLevelWithNested2: {
                thirdLevel: string;
            };
        };
    };

    type derp = PickDeep<TestObject, ['topLevelWithNested1']>;

    it('should accept valid types', () => {
        assertTypeOf<PickDeep<TestObject, ['topLevel']>>().toEqualTypeOf<{topLevel: string}>();

        assertTypeOf<PickDeep<TestObject, ['topLevelWithNested1']>>().toEqualTypeOf<{
            topLevelWithNested1: TestObject['topLevelWithNested1'];
        }>();

        assertTypeOf<
            PickDeep<TestObject, ['topLevel' | 'topLevelWithNested1', 'secondLevel1']>
        >().toEqualTypeOf<{
            topLevel: string;
            topLevelWithNested1: {
                secondLevel1: string;
            };
        }>();
        assertTypeOf<
            PickDeep<
                TestObject,
                [
                    'topLevel' | 'topLevelWithNested1' | 'topLevelWithNested2',
                    'secondLevel1' | 'secondLevel2',
                ]
            >
        >().toEqualTypeOf<{
            topLevel: string;
            topLevelWithNested1: {
                secondLevel1: string;
            };
            topLevelWithNested2: {
                secondLevel2: string;
            };
        }>();
        assertTypeOf<
            PickDeep<
                TestObject,
                [
                    'topLevel' | 'topLevelWithNested1' | 'topLevelWithNested2',
                    'secondLevel1' | 'secondLevel2' | 'secondLevelWithNested2',
                    'thirdLevel',
                ]
            >
        >().toEqualTypeOf<{
            topLevel: string;
            topLevelWithNested1: {
                secondLevel1: string;
            };
            topLevelWithNested2: {
                secondLevel2: string;
                secondLevelWithNested2: {
                    thirdLevel: string;
                };
            };
        }>();
    });
});
