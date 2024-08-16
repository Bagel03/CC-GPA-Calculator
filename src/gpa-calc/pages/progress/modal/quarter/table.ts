import { fetchClasses } from "../../../../api/classes.js";
import { ClassType } from "../../../../grades/class_type.js";
import { Grade } from "../../../../grades/grade.js";
import { GpaFormula } from "../../../../grades/gpa.js";
import { createEl } from "../../../../utils/elements.js";
import { selectContentEditableElement } from "../../../../utils/select.js";
import { addToolTip, removeToolTip } from "../../../../utils/tooltip.js";
import { getCurrentGPAFormula, rerenderAllGPAs } from "./footer.js";

export async function renderTable(
    gpaFormula: GpaFormula,
    hideIgnoredClasses = true,
    hideNoGradeClasses = false
) {
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

    table.dataset.hideIgnoredClasses = hideIgnoredClasses.toString();
    table.dataset.hideNoGradeClasses = hideNoGradeClasses.toString();

    const body = createEl("tbody");
    table.append(body);
    const classes = await fetchClasses();

    let numIgnored = 0;
    let numWithoutGrades = 0;
    const classRows: HTMLTableRowElement[] = [];

    const rows: HTMLTableRowElement[] = [];
    classes.forEach(c => {
        const row = createEl("tr");
        classRows.push(row);
        body.append(row);

        const name = c.sectionidentifier;
        const type: ClassType = ClassType.fromName(name);

<<<<<<< HEAD
        if (gpaFormula.ignoredClasses.includes(type) && c.cumgrade == null) {
            numIgnored++;
            if (hideIgnoredClasses) row.hidden = true;
        } else if (gpaFormula.ignoredClasses.includes(type)) {
            numIgnored++;
            if (hideIgnoredClasses) row.hidden = true;
        } else if (c.cumgrade == null) {
            numWithoutGrades++;
            if (hideNoGradeClasses) row.hidden = true;
        }
=======
        row.dataset.classType = type.id.toString();
        row.dataset.hasGrade = (c.cumgrade != null).toString();
        rows.push(row);

        // if (gpaFormula.ignoredClasses.includes(type) && c.cumgrade == null) {
        //     numIgnored++;
        //     if (hideIgnoredClasses) row.hidden = true;
        // } else if (gpaFormula.ignoredClasses.includes(type)) {
        //     numIgnored++;
        //     if (hideIgnoredClasses) row.hidden = true;
        // } else if (c.cumgrade == null) {
        //     numWithoutGrades++;
        //     if (hideNoGradeClasses) row.hidden = true;
        // }
>>>>>>> 46e24e8f9c298327be3405a29a9610bf019a0c88

        const fakeGrade = c.cumgrade == null;
        const ignoredGrade = gpaFormula.ignoredClasses.includes(type);

        const grade = new Grade(parseFloat(c.cumgrade) || 100);

        row.dataset.classType = type.id.toString();
        row.dataset.grade = grade.percentage.toString();
        row.dataset.hasGrade = (c.cumgrade !== null).toString();

        const els = [
            createEl("th", ["col-md-5"], name.replace(/ - [0-9] \(Period [0-9]\)/, "").trim()),
            createEl("th", ["col-md-2"], type.name),
            createEl("th", ["col-md-2"], grade.percentage + "%", {
                contentEditable: "true",
            }),
            createEl("th", ["col-md-1"], grade.toString(), {
                contentEditable: "true",
            }),
            // Add some stuff so the formula dropdown can change it
            createEl("th", ["col-md-1", "table-gpa"], gpaFormula.calc(grade, type).toFixed(2), {
                "data-raw-grade": grade.percentage.toString(),
                "data-class-type": type.id.toString(),
            }),
        ];

        row.append(...els);

        const [nameEl, typeEl, gradeEl, markEl, gpaEl] = els;

        if (fakeGrade) {
            addToolTip(gradeEl, "This class doesn't have any grades yet");
        }

        if (ignoredGrade) {
            addToolTip(nameEl, "This class is ignored by the current GPA formula");
        }
        [gradeEl, markEl].forEach(el => {
            el.addEventListener("focus", () => {
                selectContentEditableElement(el);
            });
            el.addEventListener("keydown", e => {
                if (e.key === "Enter") el.blur();
            });
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

<<<<<<< HEAD
=======
    // Bottom text (Table does not include 3 unmarked classes and 2 without grades)
    // const currentlyIncludesStrs: string[] = [];
    // const doesNotIncludeStrs: string[] = [];
    // const strs = (hidden: boolean) => (hidden ? doesNotIncludeStrs : currentlyIncludesStrs);

    // // // Returns "class" or "classes" depending on the number put in
    // const pluralClass = num => `class${num > 1 ? "es" : ""}`;

    // for (const target of ["hideNoGradeClasses", "hideIgnoredClasses"]) {
    //     window["CC_GPA_CALC_SHOW_HIDE" + target] = async function () {
    //         let newNumIgnored = 0;
    //         let newNumWithoutGrades = 0;

    //         for (const row of rows) {
    //             row.hidden = false;

    //             const newType = ClassType.getById(row.dataset.classType);
    //             const newHasGrade = row.dataset.hasGrade.toBool();

    //             if (gpaFormula.ignoredClasses.includes(newType) && !newHasGrade) {
    //                 newNumIgnored++;
    //                 if (hideIgnoredClasses) row.hidden = true;
    //             } else if (gpaFormula.ignoredClasses.includes(newType)) {
    //                 newNumIgnored++;
    //                 if (hideIgnoredClasses) row.hidden = true;
    //             } else if (!newHasGrade) {
    //                 newNumWithoutGrades++;
    //                 if (hideNoGradeClasses) row.hidden = true;
    //             }
    //         }
    //         document.getElementById("gpa-table-footer-text").innerHTML = getFooterText(
    //             newNumIgnored,
    //             newNumWithoutGrades,
    //             hideIgnoredClasses,
    //             hideNoGradeClasses
    //         );

    //         // table.replaceWith(
    //         //     await renderTable(gpaFormula, options.hideIgnoredClasses, options.hideNoGradeClasses)
    //         // );
    //     };
    // }

    // if (numIgnored > 0) {
    //     strs(hideIgnoredClasses).push(
    //         `${numIgnored} ${pluralClass(numIgnored)} that ${
    //             numIgnored == 1 ? "does" : "do"
    //         } not impact GPA (${showHideLink("hideIgnoredClasses")})`
    //     );
    // }

    // if (numWithoutGrades > 0) {
    //     strs(hideNoGradeClasses).push(
    //         `${numWithoutGrades} ${pluralClass(numWithoutGrades)} without grades (${showHideLink(
    //             "hideNoGradeClasses"
    //         )})`
    //     );
    // }

    // const currentlyIncludesStr = currentlyIncludesStrs.join(" and ");
    // const doesNotIncludeStr = doesNotIncludeStrs.join(" or ");
    // const bothStrs = [currentlyIncludesStr, doesNotIncludeStr].filter(str => !!str);

    // const fullString =
    //     currentlyIncludesStr !== ""
    //         ? "Table currently includes " + bothStrs.join(" and does not include ")
    //         : "Table does not include " + doesNotIncludeStr;

>>>>>>> 46e24e8f9c298327be3405a29a9610bf019a0c88
    // const includes = {
    //     [true]: "currently includes",
    //     [false]: "does not include",
    // };

    // const showHide = {
    //     [true]: "hide",
    //     [false]: "show",
    // };

    // const doesIncludeStrs: string[] = [];
    // const doesNotIncludeStrs: string[] = [];
    // const strs = {
    //     [false]: doesIncludeStrs,
    //     [true]: doesNotIncludeStrs,
    // };

    // if (numIgnored > 0) {
    //     strs[hideIgnoredClasses].push(
    //         `${numIgnored} ignored ${pluralClass(numIgnored)} (<a>${showHide(hideIgnoredClasses)}</a>)`
    //     );
    // }

    // if (numWithoutGrades > 0) {
    //     strs[hideNoGradeClasses].push(`${numWithoutGrades} ${pluralClass(numWithoutGrades)} without grades`);
    // }
    const showHideLink = (target: "hideIgnoredClasses" | "hideNoGradeClasses") => {
        const options = {
            hideIgnoredClasses,
            hideNoGradeClasses,
        };
        options[target] = !options[target];

        const currentGPAFormula = getCurrentGPAFormula();
        window["CC_GPA_CALC_SHOW_HIDE" + target] = async function () {
            let newNumIgnored = 0;
            let newNumWithoutGrades = 0;

<<<<<<< HEAD
            for (const row of classRows) {
                row.hidden = false;

                const classType = ClassType.getById(row.dataset.classType);
                const hasGrade = Boolean(row.dataset.hasGrade);

                if (currentGPAFormula.processesType(classType) && !hasGrade) {
                    newNumIgnored++;
                    if (currentGPAFormula) row.hidden = true;
                } else if (gpaFormula.processesType(classType)) {
                    newNumIgnored++;
                    if (options.hideIgnoredClasses) row.hidden = true;
                } else if (!hasGrade) {
                    newNumWithoutGrades++;
                    if (options.hideNoGradeClasses) row.hidden = true;
                }
            }

            table.lastElementChild.replaceWith(
                getFooterText(
                    newNumIgnored,
                    newNumWithoutGrades,
                    options.hideIgnoredClasses,
                    options.hideNoGradeClasses,
                    showHideLink
                )
            );
            // table.replaceWith(
            //     await renderTable(gpaFormula, options.hideIgnoredClasses, options.hideNoGradeClasses)
            // );
        };

        return `<a class="accordion-toggle" style="color: #007ca6"onclick=window.CC_GPA_CALC_SHOW_HIDE${target}()>${
            options[target] ? "hide" : "show"
        }</a>`;
    };

    table.append(
        getFooterText(numIgnored, numWithoutGrades, hideIgnoredClasses, hideNoGradeClasses, showHideLink)
    );
=======
    const unmarkedCol = createEl(
        "th",
        ["muted"],
        "", //getFooterText(numIgnored, numWithoutGrades, hideIgnoredClasses, hideNoGradeClasses),
        { colspan: "5", id: "gpa-table-footer-text" },
        { textAlign: "center" }
    );
    unmarkedRow.append(unmarkedCol);

    hideHiddenClassesInTable(table);

>>>>>>> 46e24e8f9c298327be3405a29a9610bf019a0c88
    // table.append(createEl("div", ["muted"], , {}, { margin: "-15px 0px 25px 110px;", width: "100%", textAlign: "center" }))

    return table;
}

<<<<<<< HEAD
=======
export function hideHiddenClassesInTable(table?: HTMLTableElement) {
    table ??= document.getElementById("gpa-table") as HTMLTableElement;
    const rows = Array.from(table.getElementsByTagName("tr"));
    // get rid of the footer & header
    const header = rows.shift();
    const footer = rows.pop();

    const formula = getCurrentGPAFormula();
    const hideNoGradeClasses = table.dataset.hideNoGradeClasses.toBool();
    const hideIgnoredClasses = table.dataset.hideIgnoredClasses.toBool(); // { hideNoGradeClasses, hideIgnoredClasses } = table.dataset;

    let numWithoutGrades = 0;
    let numIgnored = 0;
    for (const row of rows) {
        row.hidden = false;
        const rowType = ClassType.getById(row.dataset.classType);
        const rowHasGrade = row.dataset.hasGrade.toBool();

        if (!formula.processesType(rowType) && !rowHasGrade) {
            numIgnored++;
            if (hideIgnoredClasses) row.hidden = true;
        } else if (!formula.processesType(rowType)) {
            numIgnored++;
            if (hideIgnoredClasses) row.hidden = true;
        } else if (!rowHasGrade) {
            numWithoutGrades++;
            if (hideNoGradeClasses) row.hidden = true;
        }
    }

    footer.firstElementChild.innerHTML = getFooterText(
        numIgnored,
        numWithoutGrades,
        hideIgnoredClasses,
        hideNoGradeClasses,
        table
    );
}

// @ts-expect-error
window.CC_GPA_CALC_GPA_TABLE_TOGGLE = function (target: "hideIgnoredClasses" | "hideNoGradeClasses") {
    const table = document.getElementById("gpa-table");
    table.dataset[target] = (!table.dataset[target].toBool()).toString();
    hideHiddenClassesInTable();
    rerenderAllGPAs();
};

function showHideLink(target: "hideIgnoredClasses" | "hideNoGradeClasses", table?: HTMLTableElement) {
    table ??= document.getElementById("gpa-table") as HTMLTableElement;
    const currentValue = table.dataset[target].toBool();
    // table.dataset[target] = (!currentValue).toString();
    const link = createEl(
        "a",
        ["accordion-toggle"],
        currentValue ? "show" : "hide",
        {},
        { color: "#007ca6" }
    );
    link.addEventListener("click", () => {
        hideHiddenClassesInTable();
        rerenderAllGPAs();
    });
    // return link;
    return `<a class="accordion-toggle" style="color: #007ca6" onclick=window.CC_GPA_CALC_GPA_TABLE_TOGGLE("${target}")>${
        currentValue ? "show" : "hide"
    }</a>`;
}

// // Returns "class" or "classes" depending on the number put in
const pluralClass = num => `class${num > 1 ? "es" : ""}`;

>>>>>>> 46e24e8f9c298327be3405a29a9610bf019a0c88
function getFooterText(
    numIgnored: number,
    numWithoutGrades: number,
    hideIgnoredClasses: boolean,
    hideNoGradeClasses: boolean,
<<<<<<< HEAD
    showHideLink: (arg: string) => string
): HTMLTableRowElement {
    // Bottom text (Table does not include 3 unmarked classes and 2 without grades)
=======
    table?: HTMLTableElement
) {
>>>>>>> 46e24e8f9c298327be3405a29a9610bf019a0c88
    const currentlyIncludesStrs: string[] = [];
    const doesNotIncludeStrs: string[] = [];
    const strs = (hidden: boolean) => (hidden ? doesNotIncludeStrs : currentlyIncludesStrs);

<<<<<<< HEAD
    // // Returns "class" or "classes" depending on the number put in
    const pluralClass = num => `class${num > 1 ? "es" : ""}`;
=======
    if (numWithoutGrades > 0) {
        strs(hideNoGradeClasses).push(
            `${numWithoutGrades} ${pluralClass(numWithoutGrades)} without grades (${showHideLink(
                "hideNoGradeClasses",
                table
            )})`
        );
    }
>>>>>>> 46e24e8f9c298327be3405a29a9610bf019a0c88

    if (numIgnored > 0) {
        strs(hideIgnoredClasses).push(
            `${numIgnored} ${pluralClass(numIgnored)} that ${
                numIgnored == 1 ? "does" : "do"
<<<<<<< HEAD
            } not impact GPA (${showHideLink("hideIgnoredClasses")})`
        );
    }

    if (numWithoutGrades > 0) {
        strs(hideNoGradeClasses).push(
            `${numWithoutGrades} ${pluralClass(numWithoutGrades)} without grades (${showHideLink(
                "hideNoGradeClasses"
            )})`
=======
            } not impact GPA (${showHideLink("hideIgnoredClasses", table)})`
>>>>>>> 46e24e8f9c298327be3405a29a9610bf019a0c88
        );
    }

    const currentlyIncludesStr = currentlyIncludesStrs.join(" and ");
    const doesNotIncludeStr = doesNotIncludeStrs.join(" or ");
    const bothStrs = [currentlyIncludesStr, doesNotIncludeStr].filter(str => !!str);

<<<<<<< HEAD
    const fullString =
        currentlyIncludesStr !== ""
            ? "Table currently includes " + bothStrs.join(" and does not include ")
            : "Table does not include " + doesNotIncludeStr;
    const unmarkedRow = createEl("tr");

    const unmarkedCol = createEl("th", ["muted"], fullString, { colspan: "5" }, { textAlign: "center" });
    unmarkedRow.append(unmarkedCol);
    return unmarkedRow;
=======
    return currentlyIncludesStr !== ""
        ? "Table currently includes " + bothStrs.join(" and does not include ")
        : "Table does not include " + doesNotIncludeStr;
>>>>>>> 46e24e8f9c298327be3405a29a9610bf019a0c88
}
