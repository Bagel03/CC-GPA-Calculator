import { Class } from "./class.js";
import { appendGrades } from "./rendering/append.js";
import { renderGPA } from "./rendering/gpa.js";
import { renderModal } from "./rendering/modal.js";
// import { renderModal } from "./rendering/modal.js";

export const CC_GPA_INJECTOR = "CC_GPA_INJECTOR";

export function createEl<T extends keyof HTMLElementTagNameMap>(
    tag: T,
    classes: string[] = [],
    innerHTML: string = "",
    attributes: Record<string, string> = {},
    styles: Partial<Record<keyof CSSStyleDeclaration, string>> = {}
): HTMLElementTagNameMap[T] {
    const el = document.createElement(tag);
    el.classList.add(CC_GPA_INJECTOR, ...classes);
    el.innerHTML = innerHTML;
    for (const [key, value] of Object.entries(attributes)) {
        el.setAttribute(key, value);
    }
    for (const [key, value] of Object.entries(styles)) {
        //@ts-ignore
        el.style[key] = value;
    }
    return el;
}

const cleanup = () => {
    const els = document.getElementsByClassName(CC_GPA_INJECTOR);
    // Loop backwards
    for (let i = els.length - 1; i > -1; i--) {
        els[i].parentElement?.removeChild(els[i]);
    }
};

export const render = (classes: Class[]) => {
    cleanup();
    renderGPA(classes);
    appendGrades(classes);
    renderModal(classes);
};
