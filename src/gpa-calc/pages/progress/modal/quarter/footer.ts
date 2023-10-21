import { ClassType } from "../../../../grades/class_type.js";
import { GpaFormula } from "../../../../grades/gpa.js";
import { Grade } from "../../../../grades/grade.js";
import { createEl } from "../../../../utils/elements.js";
import { addToolTip, removeToolTip } from "../../../../utils/tooltip.js";
import { renderExamTable } from "../exam_table.js";
import { hideHiddenClassesInTable, renderTable } from "./table.js";

export function renderFooter() {
    const footer = createEl("div", ["modal-footer"]);

    const changeFormulaButton = createEl(
        "button",
        ["btn", "btn-default", "dropdown-toggle"],
        `Change GPA Formula <span class="caret"></span>`,
        { "data-toggle": "dropdown" }
    );
    const dropdown = createEl(
        "ul",
        ["dropdown-menu"],
        GpaFormula.allFormulas
            .map(
                formula => `
            <li>
                <a data-formula=${formula.id}>${formula.name}</a>
            </li>
        `
            )
            .join(""),

        //     <li class="active">
        //         <a data-formula=${GpaFormula.CC}>CC Scale</a>
        //     </li>
        //     <li>
        //         <a data-formula=${GpaFormula.UNWEIGHTED}>Unweighted</a>
        //     </li>
        //     <li>
        //         <a data-formula=${GpaFormula.UNWEIGHTED_NO_A_PLUS}>Unweighted (No A+)</a>
        //     </li>
        // `,
        {},
        { transform: "translateY(-100%)" }
    );

    dropdown.children.item(0).classList.add("active");

    for (const link of dropdown.querySelectorAll("a")) {
        link.onclick = async function (this: HTMLLinkElement) {
            dropdown.querySelector(".active").classList.remove("active");
            this.parentElement.classList.add("active");

            rerenderAllGPAs();
            // const formulaType = parseInt(link.dataset.formula) as GpaFormula;

            // // Update the table & calculate the new GPA
            // const classes: { grade: Grade; classType: ClassType }[] = [];
            // for (const gpaSquare of document.querySelectorAll(
            //     ".table-gpa"
            // ) as NodeListOf<HTMLTableCellElement>) {
            //     const classType = parseInt(
            //         gpaSquare.dataset.classType
            //     ) as ClassType;
            //     const rawGrade = parseInt(gpaSquare.dataset.rawGrade);

            //     const grade = new Grade(rawGrade);
            //     gpaSquare.innerText = grade
            //         .getGPA(classType, formulaType)
            //         .toFixed(2);
            //     classes.push({ grade, classType });
            // }

            // // Update the number / label top left
            // const numEl = document.getElementById("gpa-number-el");
            // const tagEl = document.getElementById("gpa-formula-type-el");

            // numEl.innerHTML = getAverageGPAFromRawData(
            //     classes,
            //     formulaType
            // ).toFixed(3);
            // tagEl.innerHTML = getNameForGpaFormula(formulaType) + " GPA";
        };
    }

    const dropdownGroup = createEl("div", ["btn", "btn-group"], "", {}, { padding: "0px" });
    dropdownGroup.append(dropdown, changeFormulaButton);

    const lastBtn = createEl("button", ["btn", "btn-default", "disabled"], "Last Quarter");
    const nextBtn = createEl("button", ["btn", "btn-default", "disabled"], "Next Quarter");
    const changeViewBtn = createEl(
        "button",
        ["btn", "btn-default"],
        `Open Exam Calculator`,
        {},
        { float: "right" }
    );

    footer.append(lastBtn, nextBtn, dropdownGroup, changeViewBtn);

    changeViewBtn.addEventListener("click", async function (this: HTMLButtonElement) {
        this.classList.toggle("exam-grades");

        if (this.classList.contains("exam-grades")) {
            this.innerText = "Show Quarterly Grades";
            lastBtn.innerText = "Last Semester";
            nextBtn.innerText = "Next Semester";

            document.getElementById("gpa-table").replaceWith(await renderExamTable());

            rerenderAllGPAs();
            return;
        }

        this.innerText = "Open Exam Calculator";
        lastBtn.innerText = "Last Quarter";
        nextBtn.innerText = "Next Quarter";
        document.getElementById("gpa-table").replaceWith(await renderTable(getCurrentGPAFormula()));

        rerenderAllGPAs();
    });

    // <ul class="dropdown-menu" role="menu">            <li class="active"><a href="#" data-value="13370" data-bypass="1">3rd Quarter</a></li>            <li><a href="#" data-value="13371" data-bypass="1">4th Quarter</a></li>    </ul>
    // <button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false">    <span class="caret"></span></button>
    rerenderAllGPAs();
    return footer;
}

export function getCurrentGPAFormula(): GpaFormula {
    const parent = document.querySelector("[data-formula]")?.parentElement.parentElement;
    if (!parent) return GpaFormula.CC;
    const formulaString = parent.querySelector<HTMLLinkElement>(".active>a").dataset.formula;
    return GpaFormula.getById(parseInt(formulaString));
}

export function rerenderAllGPAs() {
    // First, remove any classes that aren't important anymore
    hideHiddenClassesInTable();

    const formulaType = getCurrentGPAFormula();

    // const formulaType = parseInt(
    //     document.querySelector<HTMLLinkElement>("a.active").dataset.formula
    // ) as GpaFormula;

    const classes: { grade: Grade; classType: ClassType }[] = [];

    for (const gpaSquare of document.querySelectorAll(".table-gpa") as NodeListOf<HTMLTableCellElement>) {
        const row = gpaSquare.parentElement as HTMLTableElement;

        removeToolTip(row.children.item(0)!);
        if (row.hidden) continue;

        const classType = ClassType.getById(parseInt(row.dataset.classType));
        if (!formulaType.processesType(classType)) {
            addToolTip(
                row.children.item(0)! as HTMLElement,
                "This class is ignored by the current GPA formula"
            );
        }

        const rawGrade = parseFloat(row.childNodes.item(2).textContent);

        const grade = new Grade(rawGrade);
        gpaSquare.innerText = formulaType.calc(grade, classType).toFixed(2);
        classes.push({ grade, classType });
    }

    // Update the number / label top left
    const numEl = document.getElementById("gpa-number-el");
    const tagEl = document.getElementById("gpa-formula-type-el");

    numEl.innerHTML = formulaType.getAverageGPA(classes).toFixed(3); //  getAverageGPAFromRawData(classes, formulaType).toFixed(3);
    tagEl.innerHTML = formulaType.name;
}
