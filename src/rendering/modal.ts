import { Class } from "../class.js";
import { CC_GPA_INJECTOR, createEl } from "../renderer.js";
import { Semester } from "../semester.js";
import {
    getButtonCSS,
    initButtonEventListeners,
    renderButtons,
} from "./modal/buttons.js";
import { getGpaCSS, renderModalGpa } from "./modal/gpa.js";
import { getTableCSS, renderTable } from "./modal/table.js";

export function renderModal(classes: Class[]) {
    modalOptions.classes = classes;
    modalOptions.originalClasses = classes;
    const style = createEl(
        "style",
        [],
        getButtonCSS() + getGpaCSS() + getTableCSS()
    );
    document.head.appendChild(style);

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

    modal.append(close, renderModalGpa(), renderTable(), renderButtons());
    document.body.appendChild(modal);
    initButtonEventListeners();
}

export const modalOptions = {
    isHypothetical: false,
    isUnweighted: false,
    isSemester: false,
    classes: [] as Class[],
    originalClasses: [] as Class[],
    semesterClasses: null as null | Semester[],
};
