import {getRuntimeType} from '@augment-vir/assert';

getRuntimeType(['a']); // RuntimeType.Array
getRuntimeType({a: 'a'}); // RuntimeType.Object
