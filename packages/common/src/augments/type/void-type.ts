/**
 * Require that the NonVoid parameter is not void. If it is void, the ErrorType or an error string
 * type is returned. If it not void, the given SuccessType is returned.
 */
export type RequireNonVoid<
    NonVoid,
    SuccessType,
    ErrorType = 'Input should not be void',
> = void extends NonVoid ? (NonVoid extends void ? ErrorType : SuccessType) : SuccessType;
