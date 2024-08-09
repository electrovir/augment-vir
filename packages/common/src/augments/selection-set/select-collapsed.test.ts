import {describe, it, itCases} from '@augment-vir/test';
import {assertTypeOf} from 'run-time-assertions';
import {AnyObject} from '../object/generic-object-type.js';
import {PartialWithUndefined} from '../object/partial-type.js';
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
        assertTypeOf(
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
        ).toEqualTypeOf<number | undefined>();
    });
});

describe('PickCollapsedSelection', () => {
    it('collapses selection', () => {
        assertTypeOf<
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
        >().toEqualTypeOf<{
            grandChild: {
                child: string;
                child2: number;
                child3: RegExp;
            };
        }>();
    });

    it('allows selecting into potentially undefined properties', () => {
        assertTypeOf<
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
        >().toEqualTypeOf<string[]>();

        assertTypeOf<
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
        >().toEqualTypeOf<undefined | string[]>();
    });

    it('collapses to a primitive', () => {
        assertTypeOf<
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
        >().toEqualTypeOf<RegExp>();
    });
    it('preserves selections with multiple branches', () => {
        assertTypeOf<
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
        >().toEqualTypeOf<{
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
