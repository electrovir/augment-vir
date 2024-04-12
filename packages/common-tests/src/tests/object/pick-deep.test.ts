import {PickDeep, PickDeepStrict} from '@augment-vir/common';
import {describe, it} from 'mocha';
import {assertTypeOf} from 'run-time-assertions';

describe('PickDeepStrict', () => {
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

    it('works with nested keys that only exist on some nested values', () => {
        type TestObjectWithMethods = {
            topLevel: () => void;
            topLevel2: {
                nested: {
                    nested2: {
                        hello: string;
                    };
                };
                nestedSibling: {
                    something: number;
                };
            };
        };

        type Picked = PickDeepStrict<TestObjectWithMethods, ['topLevel' | 'topLevel2', 'nested']>;

        assertTypeOf<Picked>().toEqualTypeOf<{
            topLevel: () => void;
            topLevel2: {
                nested: {
                    nested2: {
                        hello: string;
                    };
                };
            };
        }>();
    });

    it('should accept valid types', () => {
        assertTypeOf<PickDeepStrict<TestObject, ['topLevel']>>().toEqualTypeOf<{
            topLevel: string;
        }>();

        assertTypeOf<PickDeepStrict<TestObject, ['topLevelWithNested1']>>().toEqualTypeOf<{
            topLevelWithNested1: TestObject['topLevelWithNested1'];
        }>();

        assertTypeOf<
            PickDeepStrict<TestObject, ['topLevel' | 'topLevelWithNested1', 'secondLevel1']>
        >().toEqualTypeOf<{
            topLevel: string;
            topLevelWithNested1: {
                secondLevel1: string;
            };
        }>();
        assertTypeOf<
            PickDeepStrict<
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
            PickDeepStrict<
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
        withReadonlyArray: ReadonlyArray<{key1: string; key2: number; key3: boolean}>;
        withArray: {key1: string; key2: number; key3: boolean}[];
        possiblyUndefined:
            | {
                  nestedMaybe:
                      | {
                            things: number;
                        }
                      | undefined;
                  stuff: string;
              }[]
            | undefined;
        topLevelWithNested2: {
            secondLevel2: string;
            secondLevelWithNested2: {
                thirdLevel: string;
            };
        };
    };

    it('works when sub keys fail to match a specific property', () => {
        assertTypeOf<
            PickDeep<TestObject, ['topLevelWithNested1' | 'topLevelWithNested2', 'secondLevel2']>
        >().toEqualTypeOf<{
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
            };
        }>();
    });

    it('fails to pick a key that is not from the given type', () => {
        assertTypeOf<
            PickDeep<TestObject, ['topLevel' | 'notReal', 'secondLevel1']>
        >().toEqualTypeOf<{
            topLevel: string;
        }>();
    });

    it('picks through unions', () => {
        assertTypeOf<
            PickDeep<TestObject, ['possiblyUndefined', 'nestedMaybe' | 'stuff']>
        >().toEqualTypeOf<{
            possiblyUndefined:
                | {
                      nestedMaybe:
                          | {
                                things: number;
                            }
                          | undefined;
                      stuff: string;
                  }[]
                | undefined;
        }>();
    });

    it('picks into arrays', () => {
        assertTypeOf<PickDeep<TestObject, ['withReadonlyArray', 'key1']>>().toEqualTypeOf<{
            withReadonlyArray: ReadonlyArray<{key1: string}>;
        }>();

        assertTypeOf<PickDeep<TestObject, ['withArray', 'key1']>>().toEqualTypeOf<{
            withArray: {key1: string}[];
        }>();
    });

    it('preserves optional properties', () => {
        assertTypeOf<
            PickDeep<
                {
                    optional1?: string;
                    optional2?: string;
                    required1: string;
                },
                ['optional1' | 'required1']
            >
        >().toEqualTypeOf<{
            optional1?: string;
            required1: string;
        }>();
    });

    it('should accept valid types', () => {
        assertTypeOf<PickDeep<TestObject, ['topLevel']>>().toEqualTypeOf<{
            topLevel: string;
        }>();

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
