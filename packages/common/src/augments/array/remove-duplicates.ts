export function removeDuplicates<Entry, UniqueId>(
    originalArray: ReadonlyArray<Readonly<Entry>>,
    calculateUniqueIdCallback: (entry: Readonly<Entry>) => UniqueId,
) {
    const grouped = new Map<UniqueId, Entry>();

    return originalArray.filter((entry) => {
        const uniqueId = calculateUniqueIdCallback(entry);
        if (grouped.get(uniqueId)) {
            return false;
        } else {
            grouped.set(uniqueId, entry);
            return true;
        }
    });
}
