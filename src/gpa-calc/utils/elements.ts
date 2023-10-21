export function createEl<T extends keyof HTMLElementTagNameMap>(
    tag: T,
    classes: string[] = [],
    innerHTML: string = "",
    attributes: Record<string, string> = {},
    styles: Partial<Record<keyof CSSStyleDeclaration, string>> = {}
): HTMLElementTagNameMap[T] {
    const el = document.createElement(tag);
    el.classList.add("CC_GPA_INJECTOR", ...classes);
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

export function clearAllElements(element: HTMLElement | Document = document) {
    Array.from(element.getElementsByClassName("CC_GPA_INJECTOR")).forEach(el => el.remove());
}

export function anyElementsPresent(element: HTMLElement | Document = document) {
    // for some reason the tooltip seems to be weird
    const elements = Array.from(element.getElementsByClassName("CC_GPA_INJECTOR"));
    return elements.filter(e => !e.classList.contains("tooltip")).length > 0;
}

