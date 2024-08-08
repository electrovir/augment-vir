export function round(value: number, {digits}: {digits: number}): number {
    const digitFactor = Math.pow(10, digits);
    const multiplied = value * digitFactor;

    return Number((Math.round(multiplied) / digitFactor).toFixed(digits));
}
