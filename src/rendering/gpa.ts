// Renders the small GPA bubble

import { Class } from "../class.js";
import { loadedClassesInfo } from "../loader.js";
import { CC_GPA_INJECTOR, createEl } from "../renderer.js";

export const renderGPA = (classesInfo: loadedClassesInfo) => {
    document
        .getElementById("performanceCollapse")!
        .getElementsByTagName("div")[0].id = "gpaParent";
    const parent = document.getElementById("gpaParent")!;

    const gradeNumber = Class.totalGPA(
        classesInfo.classes[classesInfo.defaultQuarter]!
    );
    const isNan = Number.isNaN(gradeNumber);
    const linkTitle = isNan ? "No Grades" : "CC GPA";

    const link = createEl("a", ["accordion-toggle"], linkTitle, {
        id: "gpaDisplay",
        href: `javascript:document.getElementById('${
            CC_GPA_INJECTOR + "Modal"
        }').showModal()`,
    });

    const bubbleTitle = isNan ? "N/A" : gradeNumber.toFixed(3);

    let bubble = createEl(
        "span",
        ["label", "label-success"],
        bubbleTitle,
        {},
        {
            backgroundColor: "#004F9E",
        }
    );

    parent.appendChild(bubble);
    parent.appendChild(link);
    parent.appendChild(createEl("br"));
    parent.appendChild(createEl("hr"));
};
