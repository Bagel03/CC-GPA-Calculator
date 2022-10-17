// Renders the small GPA bubble

import { Class } from "../class.js";
import { getDefaultQuarter } from "../class/load.js";
import { CC_GPA_INJECTOR, createEl } from "../renderer.js";

// Renders the quarter and semester gpa
export const renderGPA = (classes: Class[]) => {
    const parent = document
        .getElementById("performanceCollapse")!
        .getElementsByTagName("div")[0];

    const link = createEl(
        "a",
        ["accordion-toggle"],
        "",
        {
            href: `javascript:document.getElementById('${
                CC_GPA_INJECTOR + "Modal"
            }').showModal()`,
            id: "gpaLink",
        },
        {
            color: "#007ca6",
        }
    );

    const bubble = createEl(
        "span",
        ["label", "label-success"],
        "",
        {
            id: "gpaBubble",
        },
        {
            backgroundColor: "#004F9E",
        }
    );

    parent.append(bubble, link, createEl("br"), createEl("hr"));
    rerenderGPA(classes);
};

export const rerenderGPA = (classes: Class[]) => {
    const bubble = document.getElementById("gpaBubble");
    const link = document.getElementById("gpaLink");

    const gradeNumber = Class.average(classes, `gpa-${getDefaultQuarter()}`);

    const isNaN = Number.isNaN(gradeNumber);
    const linkTitle = isNaN ? "No Grades" : "CC GPA";
    const bubbleTitle = isNaN ? "N/A" : gradeNumber.toFixed(3);

    link!.innerHTML = linkTitle;
    bubble!.innerHTML = bubbleTitle;
};
