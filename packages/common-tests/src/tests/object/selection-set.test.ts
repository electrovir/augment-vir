import {itCases} from '@augment-vir/chai';
import {
    AnyObject,
    GenericSelectionSet,
    PartialAndUndefined,
    PickCollapsedSelection,
    PickSelection,
    SelectionSet,
    selectCollapsedFrom,
    selectFrom,
} from '@augment-vir/common';
import {assertTypeOf} from 'run-time-assertions';

describe('GenericSelectionSet', () => {
    it('is compatible with SelectionSet', () => {
        assertTypeOf<SelectionSet<AnyObject>>().toMatchTypeOf<GenericSelectionSet>();

        assertTypeOf<
            SelectionSet<{
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
                };
            }>
        >().toBeAssignableTo<GenericSelectionSet>();
    });
});

describe(selectCollapsedFrom.name, () => {
    itCases(selectCollapsedFrom<any, any>, [
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
    ]);
});

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

describe('SelectionSet', () => {
    it('preserves an empty object', () => {
        assertTypeOf<SelectionSet<{}>>().toEqualTypeOf<{}>();
    });
    it('defines a selection set', () => {
        assertTypeOf<
            SelectionSet<{
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
                };
            }>
        >().toEqualTypeOf<{
            hi?: boolean;
            bye?: boolean;
            parent?:
                | boolean
                | {
                      child?:
                          | boolean
                          | {
                                grandChild?:
                                    | boolean
                                    | {
                                          child?: boolean;
                                          child2?: boolean;
                                          child3?: boolean;
                                      };
                            };
                  };
        }>();
    });

    it('allows selecting into potentially undefined properties', () => {
        const test: SelectionSet<PartialAndUndefined<{top: {mid: {low: string[]}}}>> = {
            top: {
                mid: {
                    low: true,
                },
            },
        };
    });

    it('combines unions', () => {
        assertTypeOf<
            SelectionSet<{
                child: {grandChild: string} | {differentGrandChild: string};
            }>
        >().toEqualTypeOf<{
            child?:
                | boolean
                | {
                      grandChild?: boolean;
                      differentGrandChild?: boolean;
                  };
        }>();
    });

    it('skips arrays', () => {
        assertTypeOf<
            SelectionSet<{
                child: [{grandChild: string}, {differentGrandChild: string}];
            }>
        >().toEqualTypeOf<{
            child?:
                | boolean
                | {
                      grandChild?: boolean;
                      differentGrandChild?: boolean;
                  };
        }>();
    });
});

describe('PickSelection', () => {
    it('narrows to the selection set', () => {
        assertTypeOf<
            PickSelection<
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
                    hi: true;
                    bye: false;
                    parent: {
                        child: true;
                    };
                }
            >
        >().toEqualTypeOf<{
            hi: string;
            parent: {
                child: {
                    grandChild: {
                        child: string;
                        childe2: number;
                        child3: RegExp;
                    };
                };
            };
        }>();
    });

    it('allows selecting into potentially undefined properties', () => {
        assertTypeOf<
            PickSelection<
                PartialAndUndefined<{top: {mid: {low: string[]}}}>,
                {
                    top: {
                        mid: {
                            low: true;
                        };
                    };
                }
            >
        >().toEqualTypeOf<{
            top:
                | undefined
                | {
                      mid: {low: string[]};
                  };
        }>();
    });

    it('selects through arrays', () => {
        assertTypeOf<
            PickSelection<
                {
                    child: {grandChild: string; grandChild2: number}[];
                    child2: {grandChild3: string};
                },
                {
                    child: {
                        grandChild: true;
                    };
                }
            >
        >().toEqualTypeOf<{
            child: {
                grandChild: string;
            }[];
        }>();
    });
    it('works on unions', () => {
        assertTypeOf<
            PickSelection<
                {
                    child: {a: string} | {b: number};
                },
                {
                    child: {
                        a: true;
                    };
                }
            >
        >().toEqualTypeOf<{
            child:
                | {
                      a: string;
                  }
                | {};
        }>();
    });
    it('fails on an invalid selection set', () => {
        assertTypeOf<
            PickSelection<
                {
                    child: {a: string} | {b: number};
                },
                {
                    something: {
                        totally: {
                            wrong: true;
                        };
                    };
                }
            >
        >().toEqualTypeOf<{}>();
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
