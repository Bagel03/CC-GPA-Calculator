import "../styles/hover.css";
import { createEl } from "./elements.js";

let toolTip: HTMLDivElement;

export function renderToolTip() {
    toolTip = createEl("div", ["tooltip"]);

    document.body.append(toolTip);
}

<<<<<<< HEAD
export function addToolTip(element: HTMLElement, string: string) {
=======
export function addToolTip(element: HTMLElement, string: string, centerOnText = true) {
>>>>>>> 46e24e8f9c298327be3405a29a9610bf019a0c88
    element.classList.add("has-tooltip");
    element.dataset.toolTipMessage = string;

    element.addEventListener("mouseover", () => {
        if (!element.classList.contains("has-tooltip")) return;

<<<<<<< HEAD
        const { top, left, width, height, bottom } = element.getBoundingClientRect();
=======
        const range = document.createRange();
        range.selectNodeContents(element);
        const { top, left, width, height, bottom } = (centerOnText ? range : element).getBoundingClientRect();
>>>>>>> 46e24e8f9c298327be3405a29a9610bf019a0c88

        const tooltipWidth = toolTip.clientWidth;
        const tooltipHeight = toolTip.clientHeight;

        const { padding, borderWidth } = window.getComputedStyle(element);
        // console.log(padding, borderWidth);
        toolTip.style.top =
            top -
            tooltipHeight +
            window.scrollY -
            (centerOnText ? parseFloat(padding) + parseFloat(borderWidth) : 0) +
            "px";
        toolTip.style.left = left - tooltipWidth / 2 + width / 2 + "px";
        toolTip.style.opacity = "1";

        toolTip.innerHTML = element.dataset.toolTipMessage;
    });

    element.addEventListener("mouseout", () => (toolTip.style.opacity = "0"));
}

export function removeToolTip(element: Element) {
    element.classList.remove("has-tooltip");
}
