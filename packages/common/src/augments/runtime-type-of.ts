import {AnyFunction} from './function';

// this function is not used at run time, it's only here for types
// istanbul ignore next
function rawGetTypeOf(x: any) {
    return typeof x;
}

type RawTypeOf = ReturnType<typeof rawGetTypeOf>;

export type RuntimeTypeOf = RawTypeOf | 'array';

export type RuntimeTypeOfMapping = {
    array: any[];
    bigint: bigint;
    boolean: boolean;
    function: AnyFunction;
    number: number;
    object: Record<PropertyKey, unknown>;
    string: string;
    symbol: symbol;
    undefined: undefined;
};

export function getRuntimeTypeOf(input: unknown): RuntimeTypeOf {
    return Array.isArray(input) ? 'array' : typeof input;
}

export function isRuntimeTypeOf<T extends RuntimeTypeOf>(
    input: unknown,
    testType: T,
): input is RuntimeTypeOfMapping[T] {
    const inputType = getRuntimeTypeOf(input);
    return inputType === testType;
}

export function assertRuntimeTypeOf<T extends RuntimeTypeOf>(
    input: unknown,
    testType: T,
): asserts input is RuntimeTypeOfMapping[T] {
    if (!isRuntimeTypeOf(input, testType)) {
        throw new TypeError(`'${input}' is not of type '${testType}'`);
    }
}
