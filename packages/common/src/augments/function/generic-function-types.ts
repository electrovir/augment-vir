export type AnyFunction<ReturnGeneric = any> = (...args: any[]) => ReturnGeneric;
export type NoInputsFunction<ReturnGeneric = any> = () => ReturnGeneric;
