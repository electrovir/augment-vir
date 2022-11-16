function getTypeOf(x: any) {
    return typeof x;
}

export type TypeOf = ReturnType<typeof getTypeOf>;

export type TypeOfWithArray = TypeOf | 'array';

export type TypeOfMapping = {
    array: any[];
    bigint: bigint;
    boolean: boolean;
    function: (...args: any[]) => any;
    number: number;
    object: object;
    string: string;
    symbol: symbol;
    undefined: undefined;
};

export function typeOfWithArray(input: unknown): TypeOfWithArray {
    return Array.isArray(input) ? 'array' : typeof input;
}

export function isTypeOfWithArray<T extends TypeOfWithArray>(
    input: unknown,
    testType: T,
): input is TypeOfMapping[T] {
    const inputType = typeOfWithArray(input);
    return inputType === testType;
}