import {assert} from '@augment-vir/assert';
import type {Coords} from '@augment-vir/common';

export async function checkIfEntirelyInScrollView(element: Element) {
    return checkIfInScrollView(element, 1);
}

export async function checkIfInScrollView(element: Element, ratio: number) {
    return new Promise((resolve) => {
        const observer = new IntersectionObserver((entries, observerItself) => {
            assert.isLengthAtLeast(entries, 1);
            observerItself.disconnect();
            resolve(entries[0].intersectionRatio >= ratio);
        });
        observer.observe(element);
    });
}

export function getCenterOfElement(element: Element): Coords {
    const rect = element.getBoundingClientRect();

    return {
        x: Math.floor((rect.left + rect.right) / 2),
        y: Math.floor((rect.bottom + rect.top) / 2),
    };
}

export function appendPositionDebugDiv(position: Coords): HTMLDivElement {
    const div = document.createElement('div');
    div.classList.add('debug');
    div.style.backgroundColor = 'blue';
    div.style.height = '10px';
    div.style.left = `${position.x}px`;
    div.style.position = 'absolute';
    div.style.top = `${position.y}px`;
    div.style.width = '10px';
    div.style.zIndex = '9999';
    document.body.append(div);

    return div;
}
