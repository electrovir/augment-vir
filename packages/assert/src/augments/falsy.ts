// eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
export type FalsyTypes = undefined | null | false | 0 | '' | -0 | 0n;

export type Falsy<T> = Extract<T, FalsyTypes>;

export function isFalsy<T>(input: T): input is Falsy<T> {
    return !input;
}
