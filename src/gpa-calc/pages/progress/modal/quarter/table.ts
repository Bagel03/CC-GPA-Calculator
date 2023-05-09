import { fetchClasses } from "../../../../api/classes.js";
import {
    ClassType,
    getClassTypeFromName,
    getClassTypeName,
    getNumberOfClassesOfType,
} from "../../../../grades/class_type.js";
import { Grade } from "../../../../grades/grade.js";
import { createEl } from "../../../../utils/elements.js";
import { selectContentEditableElement } from "../../../../utils/select.js";
import { addToolTip, removeToolTip } from "../../../../utils/tooltip.js";
import { rerenderAllGPAs } from "./footer.js";

export async function renderTable(markingPeriod?: string) {
    // markingPeriod ??= await getCurrentMarkingPeriod();

    const table = createEl(
        "table",
        ["table", "table-striped", "table-condensed", "table-mobile-stacked"],
        "",
        { id: "gpa-table" }
    );
    const head = createEl("thead");
    table.append(head);
    const headRow = createEl("tr");
    head.append(headRow);

    headRow.append(
        createEl("th", [], "Class"),
        createEl("th", [], "Type"),
        createEl("th", [], "Grade"),
        createEl("th", [], "Mark"),
        createEl("th", [], "GPA")
    );

    const body = createEl("tbody");
    table.append(body);
    const classes = await fetchClasses();
    classes.forEach((c) => {
        const row = createEl("tr");
        body.append(row);

        const name = c.sectionidentifier;
        const type: ClassType = getClassTypeFromName(name);
        if (type == ClassType.UNMARKED) return;
        const grade = new Grade(parseFloat(c.cumgrade));

        const els = [
            createEl(
                "th",
                ["col-md-5"],
                name.replace(/ - [0-9] \(Period [0-9]\)/, "").trim()
            ),
            createEl("th", ["col-md-2"], getClassTypeName(type)),
            createEl("th", ["col-md-2"], grade.percentage + "%", {
                contentEditable: "true",
            }),
            createEl("th", ["col-md-1"], grade.toString(), {
                contentEditable: "true",
            }),
            // Add some stuff so the formula dropdown can change it
            createEl(
                "th",
                ["col-md-1", "table-gpa"],
                grade.getGPA(type).toFixed(2),
                {
                    "data-raw-grade": grade.percentage.toString(),
                    "data-class-type": type.toString(),
                }
            ),
        ];

        row.append(...els);

        const [nameEl, typeEl, gradeEl, markEl, gpaEl] = els;
        gradeEl.addEventListener("focus", () => {
            selectContentEditableElement(gradeEl);
        });
        markEl.addEventListener("focus", () => {
            selectContentEditableElement(markEl);
        });

        // Changing the grade needs to update the GPA and the mark
        gradeEl.addEventListener("blur", () => {
            const content = gradeEl.innerText.replace("%", "").trim();
            if (Number.isNaN(parseFloat(content))) {
                console.error("Could not parse grade", content);
                return;
            }

            gpaEl.dataset.rawGrade = content;
            gradeEl.innerHTML = content + "%";

            markEl.innerHTML = new Grade(parseFloat(content)).toString();
            rerenderAllGPAs();

            removeToolTip(gradeEl);
        });

        // Changing the letter needs to change the grade
        markEl.addEventListener("blur", () => {
            const grade = Grade.parseGrade(markEl.innerHTML.trim());
            gradeEl.innerHTML = grade.getNumbers();

            // Quickly blur the grade element to sync changes
            gradeEl.focus();
            gradeEl.blur();

            addToolTip(
                gradeEl,
                `<u>${grade.getNumbers()}</u> is the minium required grade for a <u>${grade.toString()}</u>`
            );
        });
    });

    const numUnmarked = getNumberOfClassesOfType(classes, ClassType.UNMARKED);
    if (numUnmarked > 0) {
        const unmarkedRow = createEl("tr");
        table.append(unmarkedRow);
        const unmarkedCol = createEl(
            "th",
            ["muted"],
            `Table does not include ${numUnmarked} unmarked classes`,
            { colspan: "5" },
            { textAlign: "center" }
        );
        unmarkedRow.append(unmarkedCol);
    }

    // table.append(createEl("div", ["muted"], , {}, { margin: "-15px 0px 25px 110px;", width: "100%", textAlign: "center" }))

    return table;
}
