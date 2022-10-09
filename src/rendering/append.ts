import { Class } from "../class.js";
import { createEl } from "../renderer.js";

// Appends the letter grade to the end of the class
export const appendGrades = (classes: Class[]) => {
    for (const classInfo of classes) {
        classInfo.rowEl
            .getElementsByClassName("showGrade")[0]
            .appendChild(
                createEl("span", [], `(${classInfo.grade.toString()})`)
            );
    }
};
