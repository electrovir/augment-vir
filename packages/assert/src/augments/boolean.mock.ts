export const falsyArray = [
    undefined,
    false,
    0,
    '',
    null,
    NaN as 0,
] as const;

export const truthyArray = [
    'stuff',
    5,
    [],
    {},
    /stuff/,
] as const;
