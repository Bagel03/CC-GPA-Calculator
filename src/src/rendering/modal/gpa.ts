import { Class, ClassProps } from "../../class.js";
import { TimeNames } from "../../class/props/time.js";
import { CC_GPA_INJECTOR, createEl } from "../../renderer.js";
import { modalOptions } from "../modal.js";

export const getGpaCSS = () => `
    #${CC_GPA_INJECTOR}ModalGpa {
        margin-top: 4px;
    }
    #${CC_GPA_INJECTOR}ModalGpaNum{
        font-weight: 500;
    }
`;

export const renderModalGpa = () => {
    const gpa = createEl("h1", [], "", { id: CC_GPA_INJECTOR + "ModalGpa" });
    const num = createEl("span", [], "hello", {
        id: CC_GPA_INJECTOR + "ModalGpaNum",
    });
    gpa.append(num);
    rerenderGpaBeforeAdded(gpa, num);
    return gpa;
};

export const rerenderGpaBeforeAdded = (
    ele: HTMLHeadingElement,
    num: HTMLSpanElement
) => {
    let title = TimeNames[modalOptions.currentView];
    if (modalOptions.isUnweighted) title += " Unweighted GPA: ";
    else title += " CC GPA: ";

    if (modalOptions.isHypothetical) title += "Hypothetical " + title;

    ele.innerText = title;

    const prop = `${modalOptions.isUnweighted ? "rawG" : "g"}pa-${
        modalOptions.currentView
    }` as keyof ClassProps;

    const gpa = Class.average(modalOptions.classes, prop);

    const gpaName = Number.isNaN(gpa) ? "No Grades" : gpa.toFixed(3);
    num.innerText = gpaName;
    num.style.color = modalOptions.isUnweighted ? "#b7da9b" : "#004F9E";
    ele.append(num);
};

export const rerenderGpa = () => {
    rerenderGpaBeforeAdded(
        document.getElementById(
            CC_GPA_INJECTOR + "ModalGpa"
        ) as HTMLHeadingElement,
        document.getElementById(CC_GPA_INJECTOR + "ModalGpaNum")!
    );
};
