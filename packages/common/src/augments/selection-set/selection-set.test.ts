import {describe, it} from '@augment-vir/test';
/* eslint-disable @typescript-eslint/no-empty-object-type */
import {AnyObject} from '@augment-vir/assert';
import {PartialWithUndefined} from '@augment-vir/core';
import {assertTypeOf} from 'run-time-assertions';
import {GenericSelectionSet, PickSelection, SelectionSet} from './selection-set.js';

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
                PartialWithUndefined<{top: {mid: {low: string[]}}}>,
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
        const test: SelectionSet<PartialWithUndefined<{top: {mid: {low: string[]}}}>> = {
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
