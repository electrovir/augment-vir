import {UnionToIntersection} from 'type-fest';
import {NestedKeys} from './nested-keys';

type InnerPickDeep<
    OriginalObjectGeneric extends object,
    DeepKeys extends any[],
> = UnionToIntersection<
    DeepKeys extends [infer CurrentLevelPick, ...infer RemainingKeys]
        ? {
              [CurrentProp in Extract<
                  CurrentLevelPick,
                  keyof OriginalObjectGeneric
              >]: OriginalObjectGeneric[CurrentProp] extends object
                  ? InnerPickDeep<OriginalObjectGeneric[CurrentProp], RemainingKeys>
                  : OriginalObjectGeneric[CurrentProp];
          }
        : DeepKeys extends [infer CurrentLevelPick]
        ? CurrentLevelPick extends keyof OriginalObjectGeneric
            ? Pick<OriginalObjectGeneric, CurrentLevelPick>
            : never
        : never
>;

export type PickDeep<
    OriginalObjectGeneric extends object,
    DeepKeys extends NestedKeys<OriginalObjectGeneric>,
> = InnerPickDeep<OriginalObjectGeneric, DeepKeys>;
