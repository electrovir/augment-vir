import {OptionalKeysOf, RequiredKeysOf} from 'type-fest';
import {AnyFunction} from '../function';
import {ArrayElement} from '../type';
import {AnyObject} from './any-object';
import {NestedKeys} from './nested-keys';

export type InnerPickDeep<
    OriginalObject extends AnyObject,
    DeepKeys extends any[],
> = DeepKeys extends [infer CurrentLevelPick, ...infer RemainingKeys]
    ? Extract<CurrentLevelPick, keyof OriginalObject> extends never
        ? OriginalObject
        : {
              [CurrentProp in Extract<
                  CurrentLevelPick,
                  RequiredKeysOf<OriginalObject>
              >]: InnerPickDeepValue<OriginalObject, CurrentProp, RemainingKeys>;
          } & {
              [CurrentProp in Extract<
                  CurrentLevelPick,
                  OptionalKeysOf<OriginalObject>
              >]?: InnerPickDeepValue<OriginalObject, CurrentProp, RemainingKeys>;
          }
    : DeepKeys extends []
      ? OriginalObject
      : DeepKeys extends [infer CurrentLevelPick]
        ? CurrentLevelPick extends keyof OriginalObject
            ? Pick<OriginalObject, CurrentLevelPick>
            : never
        : never;

type InnerPickDeepValue<
    OriginalObject,
    CurrentProp extends keyof OriginalObject,
    RemainingKeys extends any[],
> =
    AnyFunction extends Extract<OriginalObject[CurrentProp], AnyFunction>
        ? OriginalObject[CurrentProp] | Exclude<OriginalObject[CurrentProp], AnyFunction>
        : Array<any> extends Extract<OriginalObject[CurrentProp], Array<any>>
          ?
                | Array<
                      InnerPickDeep<
                          ArrayElement<Extract<OriginalObject[CurrentProp], Array<any>>>,
                          RemainingKeys
                      >
                  >
                | Exclude<OriginalObject[CurrentProp], Array<any>>
          : ReadonlyArray<any> extends Extract<OriginalObject[CurrentProp], ReadonlyArray<any>>
            ?
                  | ReadonlyArray<
                        InnerPickDeep<
                            ArrayElement<Extract<OriginalObject[CurrentProp], ReadonlyArray<any>>>,
                            RemainingKeys
                        >
                    >
                  | Exclude<OriginalObject[CurrentProp], ReadonlyArray<any>>
            : Extract<OriginalObject[CurrentProp], Record<any, any>> extends never
              ? OriginalObject[CurrentProp]
              :
                    | InnerPickDeep<
                          Extract<OriginalObject[CurrentProp], Record<any, any>>,
                          RemainingKeys
                      >
                    | Exclude<OriginalObject[CurrentProp], Record<any, any>>;

/**
 * Pick nested keys with more strict type parameter requirements. However, these stricter type
 * parameter requirements often lead to "excessively deep" TS compiler errors.
 */
export type PickDeepStrict<
    OriginalObject extends object,
    DeepKeys extends NestedKeys<OriginalObject>,
> = InnerPickDeep<OriginalObject, DeepKeys>;

/** Pick nested keys. */
export type PickDeep<OriginalObject extends object, DeepKeys extends PropertyKey[]> = InnerPickDeep<
    OriginalObject,
    DeepKeys
>;
