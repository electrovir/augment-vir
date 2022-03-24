export function clamp(
    /**
     * This uses a destructured object so that consumers cannot get confused as to which input is
     * which (which would be easy to do since they're all of the same type).
     */
    {
        value,
        min,
        max,
    }: {
        value: number;
        min: number;
        max: number;
    },
): number {
    return Math.max(Math.min(value, max), min);
}
