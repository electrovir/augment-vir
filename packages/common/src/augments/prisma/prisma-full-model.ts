import {type BaseTypeMap} from './base-prisma-types.js';
import {type PrismaBasicModel} from './prisma-basic-model.js';

export type PrismaFullModel<
    TypeMap extends BaseTypeMap,
    Model extends keyof TypeMap['model'],
> = PrismaBasicModel<TypeMap, Model> & ExpandObjects<TypeMap['model'][Model]['payload']['objects']>;

type ExpandObjects<Objects> = {
    [K in keyof Objects]: Objects[K] extends (infer U)[]
        ? U extends {scalars: any; objects: any}
            ? Array<U['scalars'] & ExpandObjects<U['objects']>>
            : Objects[K]
        : Objects[K] extends {scalars: any; objects: any}
          ? Objects[K]['scalars'] & ExpandObjects<Objects[K]['objects']>
          : Objects[K];
};
