import { fetchClasses } from "../../../../api/classes.js";
import { ClassType, getNumberOfClassesOfType } from "../../../../grades/class_type.js";
import { GpaFormula } from "../../../../grades/gpa.js";
import { createEl } from "../../../../utils/elements.js";

export async function renderHeader() {
    const row = createEl("div", ["row"]);

    const GPACol = createEl("div", ["col-md-2"]);
    row.append(GPACol);

    const classes = await fetchClasses();
    const GPA = GpaFormula.CC.getAverageGPAFromRawData(classes);

    const GPAEl = createEl("div", ["text-align-center"]);
    GPACol.append(GPAEl);

    const numEl = createEl("h1", [], GPA.toFixed(3), { id: "gpa-number-el" }, { marginTop: "0px" });
    const typeEl = createEl("h6", ["text-align-center"], GpaFormula.CC.name, { id: "gpa-formula-type-el" });
    GPAEl.append(numEl, typeEl);

    const typesEl = createEl("div", ["col-md-10"], "", {}, { marginTop: "10px" });
    row.append(typesEl);
    const typesRow = createEl("div", ["row", "mobile-inline-span", "mobile-quarter-layout"]);

    typesEl.append(typesRow);
    let types = [ClassType.REGULAR, ClassType.HONORS, ClassType.AP, ClassType.THEOLOGY, ClassType.UNMARKED];
    types = types.filter(type => getNumberOfClassesOfType(classes, type) > 0);

    let isSmall = types.length === 5;

    if (isSmall) {
        typesRow.append(createEl("div", ["col-md-1"], ""));
    }

    for (const type of types) {
        const el = createEl(
            "div",
            [`col-md-${isSmall ? 2 : 3}`],
            `
            <div class="row mobile-stacked-span">
                <div class="col-md-2">
                     <h2 style="margin:0px;">${getNumberOfClassesOfType(classes, type)}</h2>
                </div>
                <div class="col-md-9 margin-top-10" style="margin-top:10px">${type.name}</div>
            </div> 
        `
        );
        typesRow.append(el);
    }

    typesEl.append(createEl("hr", ["margin-5"]));

    return row;
}
