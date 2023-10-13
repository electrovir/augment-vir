import {NestedKeys} from './nested-keys';

type InnerPickDeep<
    OriginalObjectGeneric extends object,
    DeepKeys extends any[],
> = DeepKeys extends [infer CurrentLevelPick, ...infer RemainingKeys]
    ? {
          [CurrentProp in Extract<
              CurrentLevelPick,
              keyof OriginalObjectGeneric
          >]: OriginalObjectGeneric[CurrentProp] extends object
              ? InnerPickDeep<OriginalObjectGeneric[CurrentProp], RemainingKeys>
              : OriginalObjectGeneric[CurrentProp];
      }
    : DeepKeys extends []
    ? OriginalObjectGeneric
    : DeepKeys extends [infer CurrentLevelPick]
    ? CurrentLevelPick extends keyof OriginalObjectGeneric
        ? Pick<OriginalObjectGeneric, CurrentLevelPick>
        : never
    : never;

/**
 * Pick nested keys with more strict type parameter requirements. However, these stricter type
 * parameter requirements often lead to "excessively deep" TS compiler errors.
 */
export type PickDeepStrict<
    OriginalObjectGeneric extends object,
    DeepKeys extends NestedKeys<OriginalObjectGeneric>,
> = InnerPickDeep<OriginalObjectGeneric, DeepKeys>;

/** Pick nested keys. */
export type PickDeep<
    OriginalObjectGeneric extends object,
    DeepKeys extends PropertyKey[],
> = InnerPickDeep<OriginalObjectGeneric, DeepKeys>;
