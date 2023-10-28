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

export function round(inputs: {number: number; digits: number}): number {
    const digitFactor = Math.pow(10, inputs.digits);
    const multiplied = inputs.number * digitFactor;

    return Number((Math.round(multiplied) / digitFactor).toFixed(inputs.digits));
}
