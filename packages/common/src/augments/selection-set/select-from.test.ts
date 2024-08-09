import {describe, it, itCases} from '@augment-vir/test';
import {assertTypeOf} from 'run-time-assertions';
import {selectFrom} from './select-from.js';
import {PickSelection} from './selection-set.js';

describe(selectFrom.name, () => {
    it('has proper types', () => {
        selectFrom(
            {
                hi: 'hi',
                bye: 3,
                parent: {
                    child: {
                        grandChild: {
                            child: 'hi',
                            child2: 3,
                            child3: /something/,
                        },
                    },
                    child2: {
                        grandChild2: {
                            deep: 'hi',
                            another: 3,
                        },
                    },
                },
            },
            // @ts-expect-error: q is not a valid key
            {q: true},
        );

        const entry = {
            hi: 'hi',
            bye: 3,
            parent: {
                child: {
                    grandChild: {
                        child: 'hi',
                        child2: 3,
                        child3: /something/,
                    },
                },
                child2: {
                    grandChild2: {
                        deep: 'hi',
                        another: 3,
                    },
                },
            },
        };

        assertTypeOf(
            selectFrom(entry, {
                hi: true,
                bye: false,
                parent: {
                    child: true,
                },
            }),
        ).toEqualTypeOf<
            PickSelection<
                typeof entry,
                {
                    hi: true;
                    bye: false;
                    parent: {
                        child: true;
                    };
                }
            >
        >();

        assertTypeOf(
            selectFrom(entry, {
                hi: true,
                bye: false,
                parent: {
                    child: true,
                },
            }),
        ).toEqualTypeOf<{
            hi: string;
            parent: {
                child: {
                    grandChild: {
                        child: string;
                        child2: number;
                        child3: RegExp;
                    };
                };
            };
        }>();
    });

    itCases(selectFrom, [
        {
            it: 'picks from selection',
            inputs: [
                {
                    hi: 'hi',
                    bye: 3,
                    parent: {
                        child: {
                            grandChild: {
                                child: 'hi',
                                child2: 3,
                                child3: /something/,
                            },
                        },
                        child2: {
                            grandChild2: {
                                deep: 'hi',
                                another: 3,
                            },
                        },
                    },
                },
                {
                    hi: true,
                    bye: false,
                    parent: {
                        child: true,
                    },
                },
            ],
            expect: {
                hi: 'hi',
                parent: {
                    child: {
                        grandChild: {
                            child: 'hi',
                            child2: 3,
                            child3: /something/,
                        },
                    },
                },
            },
        },
        {
            it: 'handles an invalid selection set',
            inputs: [
                {
                    hi: 'hi',
                    bye: 3,
                    parent: {
                        child: {
                            grandChild: {
                                child: 'hi',
                                child2: 3,
                                child3: /something/,
                            },
                        },
                        child2: {
                            grandChild2: {
                                deep: 'hi',
                                another: 3,
                            },
                        },
                    },
                },
                {
                    q: true,
                },
            ],
            expect: {},
        },
        {
            it: 'handles arrays',
            inputs: [
                {
                    hi: 'hi',
                    bye: 3,
                    parent: [
                        {
                            child: {
                                grandChild: {
                                    child: 'hi',
                                    child2: 3,
                                    child3: /something/,
                                },
                            },
                        },
                        {
                            child: {
                                grandChild: {
                                    child: 'hi',
                                    child2: 4,
                                    child3: /something/,
                                },
                            },
                        },
                    ],
                },
                {
                    hi: true,
                    bye: false,
                    parent: {
                        child: {
                            grandChild: {
                                child2: true,
                            },
                        },
                    },
                },
            ],
            expect: {
                hi: 'hi',
                parent: [
                    {
                        child: {
                            grandChild: {
                                child2: 3,
                            },
                        },
                    },
                    {
                        child: {
                            grandChild: {
                                child2: 4,
                            },
                        },
                    },
                ],
            },
        },
    ]);
});
