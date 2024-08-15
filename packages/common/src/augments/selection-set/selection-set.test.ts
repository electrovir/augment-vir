/* eslint-disable @typescript-eslint/no-empty-object-type */

import {assert} from '@augment-vir/assert';
import {PartialWithUndefined, type AnyObject} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {GenericSelectionSet, PickSelection, SelectionSet} from './selection-set.js';

describe('PickSelection', () => {
    it('narrows to the selection set', () => {
        assert
            .tsType<
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
            >()
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

    it('allows selecting into potentially undefined properties', () => {
        assert
            .tsType<
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
            >()
            .equals<{
                top:
                    | undefined
                    | {
                          mid: {low: string[]};
                      };
            }>();
    });

    it('selects through arrays', () => {
        assert
            .tsType<
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
            >()
            .equals<{
                child: {
                    grandChild: string;
                }[];
            }>();
    });
    it('works on unions', () => {
        assert
            .tsType<
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
            >()
            .equals<{
                child:
                    | {
                          a: string;
                      }
                    | {};
            }>();
    });
    it('fails on an invalid selection set', () => {
        assert
            .tsType<
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
            >()
            .equals<{}>();
    });
});

describe('SelectionSet', () => {
    it('preserves an empty object', () => {
        assert.tsType<SelectionSet<{}>>().equals<{}>();
    });
    it('defines a selection set', () => {
        assert
            .tsType<
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
            >()
            .equals<{
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
        assert
            .tsType<
                SelectionSet<{
                    child: {grandChild: string} | {differentGrandChild: string};
                }>
            >()
            .equals<{
                child?:
                    | boolean
                    | (Partial<{
                          grandChild: boolean;
                      }> &
                          Partial<{
                              differentGrandChild: boolean;
                          }>);
            }>();
    });

    it('skips arrays', () => {
        assert
            .tsType<
                SelectionSet<{
                    child: [{grandChild: string}, {differentGrandChild: string}];
                }>
            >()
            .equals<{
                child?:
                    | boolean
                    | (Partial<{
                          grandChild: boolean;
                      }> &
                          Partial<{
                              differentGrandChild: boolean;
                          }>);
            }>();
    });
});

describe('GenericSelectionSet', () => {
    it('is compatible with SelectionSet', () => {
        assert.tsType<SelectionSet<AnyObject>>().matches<GenericSelectionSet>();

        assert
            .tsType<
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
            >()
            .matches<GenericSelectionSet>();
    });
});
