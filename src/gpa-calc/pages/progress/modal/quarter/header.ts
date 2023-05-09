import { fetchClasses } from "../../../../api/classes.js";
import { ClassType, getClassTypeFromName, getClassTypeName, getNumberOfClassesOfType } from "../../../../grades/class_type.js";
import { getAverageGPA } from "../../../../grades/gpa.js";
import { createEl } from "../../../../utils/elements.js";

export async function renderHeader() {
    const row = createEl("div", ["row"]);

    const GPACol = createEl("div", ["col-md-2"]);
    row.append(GPACol);

    const classes = await fetchClasses();
    const GPA = getAverageGPA(classes);

    const GPAEl = createEl("div", ["text-align-center"]);
    GPACol.append(GPAEl);

    const numEl = createEl("h1", [], GPA.toFixed(3), { id: "gpa-number-el" }, { marginTop: "0px" })
    const typeEl = createEl("h6", ["text-align-center"], "Weighted CC GPA", { id: "gpa-formula-type-el" });
    GPAEl.append(numEl, typeEl);

    const typesEl = createEl("div", ["col-md-10"], "", {}, { marginTop: "10px" });
    row.append(typesEl);
    const typesRow = createEl("div", ["row", "mobile-inline-span", "mobile-quarter-layout"])

    typesEl.append(typesRow);
    const types = [ClassType.REGULAR, ClassType.HONORS, ClassType.AP, ClassType.UNMARKED];


    for (const type of types) {
        const el = createEl("div", ["col-md-3"], `
            <div class="row mobile-stacked-span">
                <div class="col-md-2">
                     <h2 style="margin:0px;">${getNumberOfClassesOfType(classes, type)}</h2>
                </div>
                <div class="col-md-10 margin-top-10" style="margin-top:10px">${getClassTypeName(type)}</div>
            </div> 
        `);
        typesRow.append(el);
    }

    typesEl.append(createEl("hr", ["margin-5"]))

    return row;


}