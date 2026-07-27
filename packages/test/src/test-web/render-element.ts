import {type EmptyObject} from '@augment-vir/common';
import {html, type DeclarativeElementDefinition} from 'element-vir';

export async function renderElement<
    const Definition extends Readonly<DeclarativeElementDefinition>,
>(
    elementDefinition: Definition,
    ...args: Definition['InputsType'] extends EmptyObject ? [] : [Definition['InputsType']]
) {
    const {fixture} = await import('@open-wc/testing-helpers');

    const instance: Definition['InstanceType'] = await fixture(html`
        <${(elementDefinition as any).assign(args[0] || {})}></${elementDefinition as any}>
    `);

    return instance;
}
