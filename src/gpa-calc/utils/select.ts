export function selectContentEditableElement(element: HTMLElement) {
    element.focus();
    const range = document.createRange();
    range.selectNodeContents(element);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

export function selectElementOnFocus(element: HTMLElement) {
    element.addEventListener("focus", () => {
        selectContentEditableElement(element);
    });

    element.addEventListener("keydown", e => {
        if (e.code === "Enter") {
            element.blur();
            e.preventDefault();
        }
    });
}
