import {AnyFunction} from '../function';
import {ArrayElement} from '../type';
import {NestedKeys} from './nested-keys';

type InnerPickDeep<OriginalObjectGeneric, DeepKeys extends any[]> = DeepKeys extends [
    infer CurrentLevelPick,
    ...infer RemainingKeys,
]
    ? {
          [CurrentProp in Extract<
              CurrentLevelPick,
              keyof OriginalObjectGeneric
          >]: AnyFunction extends Extract<OriginalObjectGeneric[CurrentProp], AnyFunction>
              ?
                    | OriginalObjectGeneric[CurrentProp]
                    | Exclude<OriginalObjectGeneric[CurrentProp], AnyFunction>
              : Array<any> extends Extract<OriginalObjectGeneric[CurrentProp], Array<any>>
              ?
                    | Array<
                          InnerPickDeep<
                              ArrayElement<Extract<OriginalObjectGeneric[CurrentProp], Array<any>>>,
                              RemainingKeys
                          >
                      >
                    | Exclude<OriginalObjectGeneric[CurrentProp], Array<any>>
              : ReadonlyArray<any> extends Extract<
                    OriginalObjectGeneric[CurrentProp],
                    ReadonlyArray<any>
                >
              ?
                    | ReadonlyArray<
                          InnerPickDeep<
                              ArrayElement<
                                  Extract<OriginalObjectGeneric[CurrentProp], ReadonlyArray<any>>
                              >,
                              RemainingKeys
                          >
                      >
                    | Exclude<OriginalObjectGeneric[CurrentProp], ReadonlyArray<any>>
              : Extract<OriginalObjectGeneric[CurrentProp], Record<any, any>> extends never
              ? OriginalObjectGeneric[CurrentProp]
              : InnerPickDeep<
                    Extract<OriginalObjectGeneric[CurrentProp], Record<any, any>>,
                    RemainingKeys
                >;
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
