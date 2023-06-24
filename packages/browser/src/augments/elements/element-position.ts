import {assertLengthAtLeast} from '@augment-vir/common';

export type ElementPosition = {x: number; y: number};

export async function checkIfEntirelyInScrollView(element: Element) {
    return new Promise((resolve) => {
        const observer = new IntersectionObserver((entries, observerItself) => {
            assertLengthAtLeast(entries, 1);
            observerItself.disconnect();
            resolve(entries[0].intersectionRatio === 1);
        });
        observer.observe(element);
    });
}

export function getCenterOfElement(element: Element): ElementPosition {
    const rect = element.getBoundingClientRect();

    return {
        x: Math.floor((rect.left + rect.right) / 2),
        y: Math.floor((rect.bottom + rect.top) / 2),
    };
}

export function appendPositionDebugDiv(position: ElementPosition): HTMLDivElement {
    const div = document.createElement('div');
    div.classList.add('debug');
    div.style.backgroundColor = 'blue';
    div.style.height = '10px';
    div.style.width = '10px';
    div.style.position = 'absolute';
    div.style.left = `${position.x}px`;
    div.style.top = `${position.y}px`;
    document.body.append(div);

    return div;
}
