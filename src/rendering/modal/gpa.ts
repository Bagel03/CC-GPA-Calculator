import { Class } from "../../class.js";
import { CC_GPA_INJECTOR, createEl } from "../../renderer.js";
import { modalOptions } from "../modal.js";

export const getGpaCSS = () => `
    #${CC_GPA_INJECTOR}ModalGpa {
        margin-top: 4px;
    }
`;

export const renderModalGpa = () => {
    const gpa = createEl("h1", [], "", { id: CC_GPA_INJECTOR + "ModalGpa" });
    const num = createEl("span", [], "", {
        id: CC_GPA_INJECTOR + "ModalGpaNum",
    });
    gpa.appendChild(num);
    rerenderGPA(gpa, num);
    return gpa;
};

export const rerenderGPA = (ele: HTMLHeadingElement, num: HTMLSpanElement) => {
    let title;
    if (modalOptions.isUnweighted) title = "Unweighted GPA: ";
    else title = "CC GPA: ";

    // if (modalOptions.isSemester) title = "Semester " + title;
    if (modalOptions.isHypothetical) title = "Hypothetical " + title;

    ele.innerText = title;

    let gpa;
    if (modalOptions.isUnweighted)
        gpa = Class.totalRawGPA(modalOptions.classes);
    else gpa = Class.totalGPA(modalOptions.classes);

    num.innerText = gpa.toFixed(3);
    num.style.color = modalOptions.isUnweighted ? "#b7da9b" : "#004F9E";
    ele.append(num);
};
