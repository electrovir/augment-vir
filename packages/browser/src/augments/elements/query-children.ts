import {DeclarativeElementDefinition} from 'element-vir';
import {isRunTimeType} from 'run-time-assertions';
import {getNestedChildren} from './element-children';

export type ChildrenQuery = string | DeclarativeElementDefinition;

/**
 * Execute a query against all of a child's nested ancestors. Passes through shadow DOMs and
 * `<slot>` elements.
 *
 * Internally this uses `getNestedChildren` to find all the children, so any rules for finding
 * children from that function apply here.
 */
export function queryChildren(startingElement: Readonly<Element>, query: ChildrenQuery): Element[] {
    const finalQuery = isRunTimeType(query, 'string') ? query : query.tagName;
    const allNestedChildren = getNestedChildren(startingElement);
    const matches = allNestedChildren.filter((child) => child.matches(finalQuery));
    return matches;
}
