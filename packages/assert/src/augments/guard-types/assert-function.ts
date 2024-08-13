export type AssertFunction<Output> = (input: any, ...extraInputs: any[]) => asserts input is Output;
