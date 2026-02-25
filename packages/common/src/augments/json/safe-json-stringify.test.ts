import {assert} from '@augment-vir/assert';
import {isRuntimeEnv, RuntimeEnv} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {safeJsonStringify} from './safe-json-stringify.js';

describe('safeJsonStringify', () => {
    it('stringifies a simple object', () => {
        assert.strictEquals(safeJsonStringify({a: 1, b: 'two'}), '{"a":1,"b":"two"}');
    });

    it('handles a direct self-referencing circular object', () => {
        const circular: Record<string, unknown> = {a: 'hello'};
        circular['self'] = circular;

        const result = safeJsonStringify(circular);
        const parsed = JSON.parse(result);

        assert.deepEquals(parsed, {a: 'hello', self: '[Circular]'});
    });

    it('handles a deeply nested circular reference', () => {
        const root: Record<string, unknown> = {
            name: 'root',
            child: {
                name: 'child',
                grandchild: {
                    name: 'grandchild',
                } as Record<string, unknown>,
            },
        };
        (root['child'] as Record<string, unknown>)['grandchild'] = root;

        const result = safeJsonStringify(root);
        const parsed = JSON.parse(result);

        assert.deepEquals(parsed, {
            name: 'root',
            child: {
                name: 'child',
                grandchild: '[Circular]',
            },
        });
    });

    it('handles mutual circular references between two objects', () => {
        const objA: Record<string, unknown> = {name: 'a'};
        const objB: Record<string, unknown> = {name: 'b'};
        objA['ref'] = objB;
        objB['ref'] = objA;

        const result = safeJsonStringify(objA);
        const parsed = JSON.parse(result);

        assert.deepEquals(parsed, {
            name: 'a',
            ref: {
                name: 'b',
                ref: '[Circular]',
            },
        });
    });

    it('handles circular references inside arrays', () => {
        const obj: Record<string, unknown> = {value: 42};
        const arr = [
            1,
            obj,
            'hello',
        ];
        obj['arr'] = arr;

        const result = safeJsonStringify(obj);
        const parsed = JSON.parse(result);

        assert.deepEquals(parsed, {
            value: 42,
            arr: [
                1,
                '[Circular]',
                'hello',
            ],
        });
    });

    it('does not crash on an explosive deeply nested object', () => {
        /** Build a very deeply nested structure that would be expensive to stringify fully. */
        let current: Record<string, unknown> = {leaf: true};
        for (let i = 0; i < 10_000; i++) {
            current = {child: current, index: i};
        }

        /** Should not throw or run out of memory. */
        const result = safeJsonStringify(current);

        assert.isString(result);
    });

    if (isRuntimeEnv(RuntimeEnv.Web)) {
        it('handles an HTMLElement without crashing', () => {
            const div = document.createElement('div');
            div.innerHTML = '<span><b>deep</b></span>'.repeat(100);
            document.body.append(div);

            try {
                const wrapper = {element: div, extra: 'keep me'};

                /** HTMLElements have massive circular DOM trees; this must not crash. */
                const result = safeJsonStringify(wrapper);
                const parsed = JSON.parse(result);

                assert.isObject(parsed);
                assert.strictEquals(parsed.extra, 'keep me');
            } finally {
                div.remove();
            }
        });
    }
});
