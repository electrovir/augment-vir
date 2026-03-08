import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {ConstructorInstanceMap} from './constructor-instance-map.js';

describe(ConstructorInstanceMap.name, () => {
    it('adds and removes an instance with a single class', () => {
        const constructorMap = new ConstructorInstanceMap();

        const instance = /hi/;

        constructorMap.add(instance);

        const mapKeys = Array.from(constructorMap.map.keys());
        assert.isLengthExactly(mapKeys, 1);
        assert.strictEquals(mapKeys[0], RegExp);

        const setValues = Array.from(constructorMap.map.get(RegExp)?.values() || []);
        assert.isLengthExactly(setValues, 1);
        assert.strictEquals(setValues[0], instance);

        constructorMap.remove(instance);

        assert.isLengthExactly(Array.from(constructorMap.map.keys()), 1);
        assert.isEmpty(constructorMap.getInstances(RegExp));
    });
    it('adds and removes multiple instances', () => {
        const constructorMap = new ConstructorInstanceMap();

        const instance = /hi/;
        const instance2 = /bye/;

        constructorMap.add(instance);
        constructorMap.add(instance2);

        const setValues = Array.from(constructorMap.map.get(RegExp)?.values() || []);
        assert.isLengthExactly(setValues, 2);
        assert.hasValues(setValues, [
            instance,
            instance2,
        ]);

        constructorMap.destroy();
        constructorMap.destroy();
        assert.throws(() => constructorMap.add(instance));
        assert.throws(() => constructorMap.getInstances(RegExp));
        assert.throws(() => constructorMap.remove(instance));
        assert.isUndefined(constructorMap.map);
    });
    it('adds an instance with multiple inheritance', () => {
        class Parent extends RegExp {}
        class Child extends Parent {}
        class GrandChild extends Child {}

        const constructorMap = new ConstructorInstanceMap();

        const instance = new GrandChild('hi');

        constructorMap.add(instance);

        const allExpectedKeys = [
            RegExp,
            Parent,
            Child,
            GrandChild,
        ];

        const mapKeys = Array.from(constructorMap.map.keys());
        assert.isLengthExactly(mapKeys, allExpectedKeys.length);
        assert.hasValues(mapKeys, allExpectedKeys);

        allExpectedKeys.forEach((key) => {
            const setValues = Array.from(constructorMap.map.get(key)?.values() || []);
            assert.isLengthExactly(setValues, 1);
            assert.strictEquals(setValues[0], instance);
        });
    });
    it('gets instances', () => {
        class Parent extends RegExp {
            public parent = 'parent';
        }
        class Child extends Parent {
            public child = 'child';
        }
        class GrandChild extends Child {
            public grandChild = 'grandChild';
        }

        const constructorMap = new ConstructorInstanceMap();

        const instance = new GrandChild('hi');
        const instance2 = new GrandChild('bye');

        constructorMap.add(instance);
        constructorMap.add(instance2);

        const grandChildren = constructorMap.getInstances(GrandChild);
        assert.tsType(grandChildren).equals<Set<GrandChild>>();
        assert.tsType(grandChildren).notEquals<Set<Child>>();
        assert.tsType(grandChildren).notEquals<Set<Parent>>();
        assert.tsType(grandChildren).notEquals<Set<RegExp>>();

        const children = constructorMap.getInstances(Child);
        assert.tsType(children).notEquals<Set<GrandChild>>();
        assert.tsType(children).equals<Set<Child>>();
        assert.tsType(children).notEquals<Set<Parent>>();
        assert.tsType(children).notEquals<Set<RegExp>>();

        const parents = constructorMap.getInstances(Parent);
        assert.tsType(parents).notEquals<Set<GrandChild>>();
        assert.tsType(parents).notEquals<Set<Child>>();
        assert.tsType(parents).equals<Set<Parent>>();
        assert.tsType(parents).notEquals<Set<RegExp>>();

        const regExps = constructorMap.getInstances(RegExp);
        assert.tsType(regExps).notEquals<Set<GrandChild>>();
        assert.tsType(regExps).notEquals<Set<Child>>();
        assert.tsType(regExps).notEquals<Set<Parent>>();
        assert.tsType(regExps).equals<Set<RegExp>>();

        const grandChildrenArray = Array.from(grandChildren.values());
        const childrenArray = Array.from(children.values());
        const parentsArray = Array.from(parents.values());
        const regExpArray = Array.from(regExps.values());

        assert.isLengthExactly(grandChildrenArray, childrenArray.length);
        assert.hasValues(grandChildrenArray, childrenArray);
        assert.hasValues(grandChildrenArray, [
            instance,
            instance2,
        ]);
        assert.isLengthExactly(childrenArray, parentsArray.length);
        assert.hasValues(childrenArray, parentsArray);
        assert.isLengthExactly(parentsArray, regExpArray.length);
        assert.hasValues(parentsArray, regExpArray);
    });
    it('handles anonymous classes', () => {
        class Parent extends RegExp {}
        class GrandChild extends class extends Parent {} {}

        const anon = Object.getPrototypeOf(GrandChild);

        const constructorMap = new ConstructorInstanceMap();

        const instance = new GrandChild('hi');

        constructorMap.add(instance);

        const allExpectedKeys = [
            RegExp,
            Parent,
            anon,
            GrandChild,
        ];

        const mapKeys = Array.from(constructorMap.map.keys());
        assert.deepEquals(
            mapKeys.map((key) => key.name).sort(),
            [
                'RegExp',
                'Parent',
                '',
                'GrandChild',
            ].sort(),
        );
        assert.isLengthExactly(mapKeys, allExpectedKeys.length);
        assert.hasValues(mapKeys, allExpectedKeys);

        allExpectedKeys.forEach((key) => {
            const setValues = Array.from(constructorMap.map.get(key)?.values() || []);
            assert.isLengthExactly(setValues, 1);
            assert.strictEquals(setValues[0], instance);
        });
    });
});
