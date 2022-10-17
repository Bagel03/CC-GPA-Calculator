import { Class } from "../class.js";
import { getDefaultQuarter, loadElements } from "../class/load.js";
import { getNameAndPeriodFromEl, getRows } from "../class/parse.js";
import { createEl } from "../renderer.js";

// Appends the letter grade to the end of the class
export const appendGrades = (classes: Class[]) => {
    const rows = getRows();
    for (const classInfo of classes) {
        const row = rows.find(
            (r) => getNameAndPeriodFromEl(r)[0] === classInfo.getProp("name")
        );
        if (!row) continue;

        row.getElementsByClassName("showGrade")[0].appendChild(
            createEl("span", [], "", {
                id: `gradeFor${classInfo.id}`,
            })
        );
    }
    rerenderGrades(classes);
};

export const rerenderGrades = async (classes: Class[]) => {
    await loadElements();
    const quarter = getDefaultQuarter();

    for (const classInfo of classes) {
        const letter = classInfo.getProp(`gradeLetter-${quarter}`);
        if (!letter.isPresent()) continue;

        document.getElementById(
            `gradeFor${classInfo.id}`
        )!.innerText = `(${letter.getString()})`;
    }
};
