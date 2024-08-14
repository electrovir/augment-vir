/* eslint-disable @typescript-eslint/ban-ts-comment */
import {describe, it} from '@augment-vir/test';
import {assert} from '../../guards/assert.js';

describe('tsType', () => {
    it('supports equals', () => {
        assert.tsType<string>().equals('hi');
        assert.tsType<string>().equals<string>();
        assert.tsType<string>().equals<string>('hi');

        assert.tsType('hi').equals('hi');
        assert.tsType('hi').equals<string>();
        assert.tsType('hi').equals<string>('hi');

        assert.tsType<string>('hi').equals('hi');
        assert.tsType<string>('hi').equals<string>();
        assert.tsType<string>('hi').equals<string>('hi');

        assert.tsType<string | number>('hi').equals<number | string>();

        // @ts-expect-error
        assert.tsType<string>().notEquals('hi');
        // @ts-expect-error
        assert.tsType<string>().notEquals<string>();
        // @ts-expect-error
        assert.tsType<string>().notEquals<string>('hi');

        // @ts-expect-error
        assert.tsType('hi').notEquals('hi');
        // @ts-expect-error
        assert.tsType('hi').notEquals<string>();
        // @ts-expect-error
        assert.tsType('hi').notEquals<string>('hi');

        // @ts-expect-error
        assert.tsType<string>('hi').notEquals('hi');
        // @ts-expect-error
        assert.tsType<string>('hi').notEquals<string>();
        // @ts-expect-error
        assert.tsType<string>('hi').notEquals<string>('hi');
    });
    it('supports notEquals', () => {
        assert.tsType<string>().notEquals(5);
        assert.tsType<string>().notEquals<number>();
        assert.tsType<string>().notEquals<number>(5);

        assert.tsType('hi').notEquals(5);
        assert.tsType('hi').notEquals<number>();
        assert.tsType('hi').notEquals<number>(5);

        assert.tsType<string>('hi').notEquals(5);
        assert.tsType<string>('hi').notEquals<number>();
        assert.tsType<string>('hi').notEquals<number>(5);

        assert.tsType<string>('hi').notEquals<number | string>();
        assert.tsType<string | number>('hi').notEquals<string>();

        // @ts-expect-error
        assert.tsType<string>().equals(5);
        // @ts-expect-error
        assert.tsType<string>().equals<number>();
        // @ts-expect-error
        assert.tsType<string>().equals<number>(5);

        // @ts-expect-error
        assert.tsType('hi').equals(5);
        // @ts-expect-error
        assert.tsType('hi').equals<number>();
        // @ts-expect-error
        assert.tsType('hi').equals<number>(5);

        // @ts-expect-error
        assert.tsType<string>('hi').equals(5);
        // @ts-expect-error
        assert.tsType<string>('hi').equals<number>();
        // @ts-expect-error
        assert.tsType<string>('hi').equals<number>(5);
    });
    it('can compare unknown', () => {
        assert.tsType<unknown>().notEquals<string>();
        assert.tsType<string>().notEquals<unknown>();

        // @ts-expect-error
        assert.tsType<unknown>().equals<string>();
        // @ts-expect-error
        assert.tsType<string>().equals<unknown>();
    });
    it('can compare any', () => {
        assert.tsType<any>().notEquals<string>();
        assert.tsType<string>().notEquals<any>();

        // @ts-expect-error
        assert.tsType<any>().equals<string>();
        // @ts-expect-error
        assert.tsType<string>().equals<any>();
    });
    it('can compare never', () => {
        assert.tsType<never>().notEquals<string>();
        assert.tsType<string>().notEquals<never>();

        // @ts-expect-error
        assert.tsType<never>().equals<string>();
        // @ts-expect-error
        assert.tsType<string>().equals<never>();
    });
    it('can compare void', () => {
        assert.tsType<void>().notEquals<string>();
        assert.tsType<string>().notEquals<void>();

        // @ts-expect-error
        assert.tsType<void>().equals<string>();
        // @ts-expect-error
        assert.tsType<string>().equals<void>();
    });
});
