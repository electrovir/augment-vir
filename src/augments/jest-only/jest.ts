export function assertInstanceOf<T>(
    input: unknown,
    classConstructor: new (...args: any) => T,
): asserts input is T {
    expect(input).toBeInstanceOf(classConstructor);
}

export function assertNotNullish<T>(input: T): asserts input is NonNullable<T> {
    expect(input).not.toBeNull();
    expect(input).not.toBeUndefined();
}
