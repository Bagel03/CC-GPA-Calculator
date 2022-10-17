import { Class } from "../class.js";
import { getDefaultQuarter } from "../class/load.js";
import { GradeTime } from "../class/props/time.js";
import { CC_GPA_INJECTOR, createEl } from "../renderer.js";
import {
    getButtonCSS,
    initButtonEventListeners,
    renderButtons,
} from "./modal/buttons.js";
import { getGpaCSS, renderModalGpa } from "./modal/gpa.js";
import { getSelectorCss, renderTimeSelector } from "./modal/selector.js";
import { getTableCSS, renderTable } from "./modal/table.js";

export function resetClasses() {
    modalOptions.classes = modalOptions.originalClasses.map((c) => c.clone());
}

export function loadCSS() {
    const style = createEl(
        "style",
        [],
        getButtonCSS() + getGpaCSS() + getTableCSS() + getSelectorCss()
    );
    document.head.appendChild(style);
}

export function renderModal(classes: Class[]) {
    modalOptions.originalClasses = classes;
    modalOptions.currentView = getDefaultQuarter();

    resetClasses();

    loadCSS();

    const modal = createEl("dialog", [], "", { id: CC_GPA_INJECTOR + "Modal" });
    const close = createEl(
        "a",
        [],
        "Close",
        {
            href: `javascript:document.getElementById("${
                CC_GPA_INJECTOR + "Modal"
            }").close()`,
        },
        {
            cursor: "click",
            position: "absolute",
            top: "4%",
            right: "2%",
        }
    );

    modal.append(
        close,
        renderModalGpa(),
        renderTable(),
        renderButtons(),
        renderTimeSelector()
    );

    document.body.appendChild(modal);
    initButtonEventListeners();
}

export const modalOptions = {
    isHypothetical: false,
    isUnweighted: false,
    currentView: GradeTime.FIRST_QUARTER,
    classes: [] as Class[],
    originalClasses: [] as Class[],
};
