import { Class } from "../class.js";
import { loadedClassesInfo } from "../loader.js";
import { CC_GPA_INJECTOR, createEl } from "../renderer.js";
import {
    getButtonCSS,
    initButtonEventListeners,
    renderButtons,
} from "./modal/buttons.js";
import { getGpaCSS, renderModalGpa } from "./modal/gpa.js";
import { getTableCSS, renderTable } from "./modal/table.js";

export function resetClasses() {
    modalOptions.classes = modalOptions.originalClasses.map((c) => c.clone());
}

export function renderModal(classInfo: loadedClassesInfo) {
    modalOptions.originalClasses = classInfo.classes[classInfo.defaultQuarter]!;
    resetClasses();
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

    modal.append(close);
    if (modalOptions.classes.length == 0) {
        modal.append(
            createEl("h1", [], "No Quarter Grades", {}, { margin: "20px" })
        );
    } else {
        modal.append(renderModalGpa(), renderTable(), renderButtons());
    }

    document.body.appendChild(modal);
    if (modalOptions.classes.length > 0) initButtonEventListeners();
}

export enum Quarter {
    FirstQuarter,
    SecondQuarter,
}

export const modalOptions = {
    isHypothetical: false,
    isUnweighted: false,
    currentType: Quarter.FirstQuarter,
    classes: [] as Class[],
    originalClasses: [] as Class[],
};
