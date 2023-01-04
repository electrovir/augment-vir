import {UnionToIntersection} from 'type-fest';
import {NestedKeys} from './nested-keys';

export type PickDeep<
    OriginalObjectGeneric extends object,
    DeepKeys extends NestedKeys<OriginalObjectGeneric>,
> = UnionToIntersection<
    DeepKeys extends [infer CurrentLevelPick, ...infer ExtraKeys]
        ? CurrentLevelPick extends PropertyKey
            ? CurrentLevelPick extends keyof OriginalObjectGeneric
                ? {
                      [CurrentProp in CurrentLevelPick]: OriginalObjectGeneric[CurrentProp] extends object
                          ? ExtraKeys extends NestedKeys<OriginalObjectGeneric[CurrentProp]>
                              ? PickDeep<OriginalObjectGeneric[CurrentProp], ExtraKeys>
                              : {}
                          : OriginalObjectGeneric[CurrentProp];
                  }
                : never
            : never
        : DeepKeys extends [infer CurrentLevelPick]
        ? CurrentLevelPick extends keyof OriginalObjectGeneric
            ? Pick<OriginalObjectGeneric, CurrentLevelPick>
            : never
        : never
>;
