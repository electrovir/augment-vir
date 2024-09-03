import {DeclarativeElement, DeclarativeElementDefinition} from 'element-vir';
import {SpecTagName, ensureSpecTagName} from 'html-spec-tags';

/**
 * Reduce an element down to its tag name or its element definition if it's a custom element defined
 * by element-vir. Note that the types for this won't work in your project if you use custom element
 * tag names that aren't generated via element-vir.
 *
 * @category Web : Elements
 * @category Package : @augment-vir/web
 * @package [`@augment-vir/web`](https://www.npmjs.com/package/@augment-vir/web)
 */
export function toTagOrDefinition(element: Element): DeclarativeElementDefinition | SpecTagName {
    if (element instanceof DeclarativeElement) {
        return element.definition;
    } else {
        return ensureSpecTagName(element.tagName.toLowerCase());
    }
}
