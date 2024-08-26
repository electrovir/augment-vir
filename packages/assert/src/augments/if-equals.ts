import type {IsEqual} from 'type-fest';

/** If `Actual` === `Expected`, then `Yes`. Else `No`. */
export type IfEquals<Actual, Expected, Yes = unknown, No = never> =
    IsEqual<Actual, Expected> extends true ? Yes : No;

/** If `Actual` extends `Expected`, then `Yes`. Else type `N`. */
export type IfExtends<Actual, Expected, Yes = unknown, No = never> = Actual extends Expected
    ? Yes
    : No;
