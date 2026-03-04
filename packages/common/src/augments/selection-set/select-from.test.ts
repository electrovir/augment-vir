import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {selectFrom} from './select-from.js';
import {type SelectFrom} from './selection-set.js';

describe(selectFrom.name, () => {
    it('preserves nested optional properties', () => {
        type ExampleWithOptional = {
            a: string;
            b?: number;
            c: {
                d?: RegExp;
                e?: {
                    f?: Set<string>;
                };
            };
        };

        assert
            .tsType<
                SelectFrom<
                    ExampleWithOptional,
                    {
                        b: true;
                        c: {
                            d: true;
                            e: true;
                        };
                    }
                >
            >()
            .slowEquals<{
                b?: number;
                c: {
                    d?: RegExp;
                    e?: {
                        f?: Set<string>;
                    };
                };
            }>();
    });

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
            {
                q: true,
            },
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

        assert
            .tsType(
                selectFrom(entry, {
                    hi: true,
                    bye: false,
                    parent: {
                        child: true,
                    },
                }),
            )
            .equals<
                SelectFrom<
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

        assert
            .tsType(
                selectFrom(entry, {
                    hi: true,
                    bye: false,
                    parent: {
                        child: true,
                    },
                }),
            )
            .equals<{
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
