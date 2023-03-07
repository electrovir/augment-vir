export function hasKey<ParentType>(
    parent: ParentType,
    property: PropertyKey,
): property is keyof ParentType {
    return property in (parent as any);
}
