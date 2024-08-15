import {assert} from '@augment-vir/assert';
import {PartialWithUndefined, type AnyObject} from '@augment-vir/core';
import {describe, it, itCases} from '@augment-vir/test';
import {PickCollapsedSelection, selectCollapsedFrom} from './select-collapsed.js';
import {GenericSelectionSet} from './selection-set.js';

describe(selectCollapsedFrom.name, () => {
    function testSelectCollapsedFrom(full: AnyObject, selection: GenericSelectionSet) {
        return selectCollapsedFrom(full, selection) as any;
    }

    itCases(testSelectCollapsedFrom, [
        {
            it: 'collapses a selection',
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
                    parent: {
                        child: {
                            grandChild: {
                                child2: true,
                            },
                        },
                    },
                },
            ],
            expect: [
                3,
                4,
            ],
        },
        {
            it: 'does not collapse past the selected object',
            inputs: [
                {
                    entries: {
                        one: {
                            child: 1,
                            child2: 2,
                        },
                    },
                },
                {
                    entries: true,
                },
            ],
            expect: {
                one: {
                    child: 1,
                    child2: 2,
                },
            },
        },
        {
            it: 'handles an undefined mid-value',
            inputs: [
                {
                    hi: 'hi',
                    bye: 3,
                    parent: {
                        child: undefined,
                        child2: {
                            grandChild: {
                                child: 'hi',
                                child2: 4,
                                child3: /something/,
                            },
                        },
                    },
                },
                {
                    parent: {
                        child: {
                            grandChild: {
                                child2: true,
                            },
                        },
                    },
                },
            ],
            expect: undefined,
        },
        {
            it: 'handles an undefined mid-value in array',
            inputs: [
                {
                    hi: 'hi',
                    bye: 3,
                    parent: [
                        {
                            child: undefined,
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
                    parent: {
                        child: {
                            grandChild: {
                                child2: true,
                            },
                        },
                    },
                },
            ],
            expect: [
                undefined,
                4,
            ],
        },
    ]);

    it('has proper types', () => {
        assert
            .tsType(
                selectCollapsedFrom(
                    {
                        hi: 'hi',
                        bye: 3,
                        parent: {
                            child: undefined as
                                | undefined
                                | {
                                      grandChild: {
                                          child: string;
                                          child2: number;
                                          child3: RegExp;
                                      };
                                  },
                            child2: {
                                grandChild: {
                                    child: 'hi',
                                    child2: 4,
                                    child3: /something/,
                                },
                            },
                        },
                    },
                    {
                        parent: {
                            child: {
                                grandChild: {
                                    child2: true,
                                },
                            },
                        },
                    },
                ),
            )
            .equals<number | undefined>();
    });
});

describe('PickCollapsedSelection', () => {
    it('collapses selection', () => {
        assert
            .tsType<
                PickCollapsedSelection<
                    {
                        hi: string;
                        bye: number;
                        parent: {
                            child: {
                                grandChild: {
                                    child: string;
                                    child2: number;
                                    child3: RegExp;
                                };
                            };
                            child2: {
                                grandChild2: {
                                    deep: string;
                                    another: number;
                                };
                            };
                        };
                    },
                    {
                        parent: {
                            child: true;
                        };
                    }
                >
            >()
            .equals<{
                grandChild: {
                    child: string;
                    child2: number;
                    child3: RegExp;
                };
            }>();
    });

    it('allows selecting into potentially undefined properties', () => {
        assert
            .tsType<
                PickCollapsedSelection<
                    {top: {mid: {low: string[]}}},
                    {
                        top: {
                            mid: {
                                low: true;
                            };
                        };
                    }
                >
            >()
            .equals<string[]>();

        assert
            .tsType<
                PickCollapsedSelection<
                    PartialWithUndefined<{top: {mid: {low: string[]}}}>,
                    {
                        top: {
                            mid: {
                                low: true;
                            };
                        };
                    }
                >
            >()
            .equals<undefined | string[]>();
    });

    it('collapses to a primitive', () => {
        assert
            .tsType<
                PickCollapsedSelection<
                    {
                        hi: string;
                        bye: number;
                        parent: {
                            child: {
                                grandChild: {
                                    child: string;
                                    child2: number;
                                    child3: RegExp;
                                };
                            };
                            child2: {
                                grandChild2: {
                                    deep: string;
                                    another: number;
                                };
                            };
                        };
                    },
                    {
                        parent: {
                            child: {
                                grandChild: {
                                    child3: true;
                                };
                            };
                        };
                    }
                >
            >()
            .equals<RegExp>();
    });
    it('preserves selections with multiple branches', () => {
        assert
            .tsType<
                PickCollapsedSelection<
                    {
                        hi: string;
                        bye: number;
                        parent: {
                            child: {
                                grandChild: {
                                    child: string;
                                    child2: number;
                                    child3: RegExp;
                                };
                            };
                            child2: {
                                grandChild2: {
                                    deep: string;
                                    another: number;
                                };
                            };
                        };
                    },
                    {
                        parent: {
                            child: {
                                grandChild: {
                                    child3: true;
                                };
                            };
                        };
                        bye: true;
                    }
                >
            >()
            .equals<{
                bye: number;
                parent: {
                    child: {
                        grandChild: {
                            child3: RegExp;
                        };
                    };
                };
            }>();
    });
});
