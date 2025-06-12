import {fixture} from '@open-wc/testing-helpers';
import {html, type DeclarativeElementDefinition} from 'element-vir';
import {type EmptyObject} from 'type-fest';

export async function renderElement<const Definition extends DeclarativeElementDefinition>(
    elementDefinition: Definition,
    ...args: Definition['InputsType'] extends EmptyObject ? [] : [Definition['InputsType']]
) {
    const instance: Definition['InstanceType'] = await fixture(html`
        <${(elementDefinition as any).assign(args[0] || {})}></${elementDefinition as any}>
    `);

    return instance;
}
