/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import {AnyObject} from '@augment-vir/core';
import {type AbstractConstructor, type Constructor, type Writable} from 'type-fest';
import {makeWritable} from '../type/writable.js';
import {getOrSetFromMap} from './get-or-set.js';

/**
 * Map all ancestor constructors of an object to a set of objects.
 *
 * @category Internal
 */
export class ConstructorInstanceMap {
    /** A map of constructors to their added instances. */
    public readonly map = new Map<Function, Set<AnyObject>>();
    public readonly isDestroyed: boolean = false;

    constructor(
        /**
         * The top most constructor to allow in the map. If this constructor is ever reached, the
         * recursive mapping stops.
         */
        protected readonly topMostConstructor?: Function | undefined,
    ) {}

    /**
     * Add a new instance, mapping each of its ancestor constructors to it inside
     * {@link ConstructorInstanceMap.map}.
     */
    public add(instance: AnyObject) {
        if (this.isDestroyed) {
            throw new Error('Cannot operate on destroyed ConstructorMap.');
        }
        this.traverseConstructors(instance, Object.getPrototypeOf(instance), 'add');
    }

    /** Gets all added instances of the given constructor. */
    public getInstances<T>(constructor: AbstractConstructor<T> | Constructor<T>): Set<T> {
        if (this.isDestroyed) {
            throw new Error('Cannot operate on destroyed ConstructorMap.');
        }
        return getOrSetFromMap(this.map, constructor, () => new Set());
    }

    /** Remove an instance, removing it from all mappings inside {@link ConstructorInstanceMap.map}. */
    public remove(instance: AnyObject) {
        if (this.isDestroyed) {
            throw new Error('Cannot operate on destroyed ConstructorMap.');
        }
        this.traverseConstructors(instance, Object.getPrototypeOf(instance), 'remove');
    }

    /** Recursively map all ancestor prototypes to the given instance. */
    protected traverseConstructors(
        instance: AnyObject,
        prototype: any,
        operation: 'add' | 'remove',
    ) {
        const constructor = prototype.constructor;
        if (
            !constructor ||
            constructor === Function ||
            constructor === Object ||
            constructor === this.topMostConstructor
        ) {
            /** Stop recursing into constructors. */
            return;
        }

        if (operation === 'add') {
            const set = getOrSetFromMap(this.map, constructor, () => new Set());
            set.add(instance);
        } else {
            const set = this.map.get(constructor);
            if (set) {
                set.delete(instance);
            }
        }
        this.traverseConstructors(instance, Object.getPrototypeOf(prototype), operation);
    }

    /** Clean up the internal map. */
    public destroy() {
        if (this.isDestroyed) {
            return;
        }
        makeWritable(this).isDestroyed = true;
        this.map.clear();
        delete (this as Writable<Partial<ConstructorInstanceMap>>).map;
    }
}
