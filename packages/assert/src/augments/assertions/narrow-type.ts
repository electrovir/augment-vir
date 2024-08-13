export type NarrowToExpected<Actual, Expected> =
    Extract<Expected, Actual> extends never
        ? Extract<Actual, Expected> extends never
            ? Expected extends Actual
                ? Expected
                : never
            : Extract<Actual, Expected>
        : Extract<Expected, Actual>;

export type NarrowToActual<Actual, Expected> =
    Extract<Actual, Expected> extends never
        ? Extract<Expected, Actual> extends never
            ? Expected extends Actual
                ? Expected
                : never
            : Extract<Expected, Actual>
        : Extract<Actual, Expected>;
