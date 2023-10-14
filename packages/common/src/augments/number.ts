export function toEnsuredNumber(input: any): number {
    const numeric = Number(input);

    if (isNaN(numeric)) {
        throw new Error(`Cannot convert given input to a number: ${input}`);
    } else {
        return numeric;
    }
}

export function wrapNumber({max, min, value}: {value: number; max: number; min: number}): number {
    if (value > max) {
        return min;
    } else if (value < min) {
        return max;
    }

    return value;
}
