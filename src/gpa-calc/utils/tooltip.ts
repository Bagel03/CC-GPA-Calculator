import "../styles/hover.css";
import { createEl } from "./elements.js";

let toolTip: HTMLDivElement;

export function renderToolTip() {
    toolTip = createEl("div", ["tooltip"]);

    document.body.append(toolTip);
}

export function addToolTip(element: HTMLElement, string: string) {
    element.classList.add("has-tooltip");
    element.dataset.toolTipMessage = string;

    element.addEventListener("mouseover", () => {
        if (!element.classList.contains("has-tooltip")) return;

        const { top, left, width, height, bottom } = element.getBoundingClientRect();

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
