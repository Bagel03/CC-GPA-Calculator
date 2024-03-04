import { fetchClasses } from "../../../api/classes.js";
import { fetchAssignments } from "../../../api/assignments.js";
import { fetchMarkingPeriods, getCurrentMarkingPeriod } from "../../../api/marking_period.js";
import { ClassType, getNumberOfClassesOfType } from "../../../grades/class_type.js";
import { getExamGradeForOverall, getOverallGrade, GradePeriod } from "../../../grades/exams.js";
import { Grade } from "../../../grades/grade.js";
import { createEl } from "../../../utils/elements.js";
import { selectElementOnFocus } from "../../../utils/select.js";
import { addToolTip, removeToolTip } from "../../../utils/tooltip.js";
import { getCurrentGPAFormula, rerenderAllGPAs } from "./quarter/footer.js";
import { shortenClassName } from "../../../utils/shorten_class.js";

export async function renderExamTable(
    year?: string,
    duration?: number,
    hideIgnoredClasses = true,
    hideNoGradeClasses = false
) {
    const table = createEl(
        "table",
        ["table", "table-striped", "table-condensed", "table-mobile-stacked"],
        "",
        { id: "gpa-table" }
    );

    table.dataset.hideIgnoredClasses = hideIgnoredClasses.toString();
    table.dataset.hideNoGradeClasses = hideNoGradeClasses.toString();

    const head = createEl("thead");
    table.append(head);
    const headRow = createEl("tr");
    head.append(headRow);

    headRow.append(
        createEl("th", [], "Class"),
        createEl("th", [], "Q1 Grade"),
        createEl("th", [], "Q2 Grade"),
        createEl("th", [], "Exam Grade"),
        createEl("th", [], "Overall"),
        createEl("th", [], "Mark"),
        createEl("th", [], "GPA")
    );

    const body = createEl("tbody");
    table.append(body);
    const classes = await fetchClasses(year, duration);

    await Promise.all(
        classes.map(async c => {
            const markingPeriods = await fetchMarkingPeriods(year, duration);
            const q1info = await fetchAssignments(c.sectionid, markingPeriods[0].MarkingPeriodId);
            const q2info = await fetchAssignments(c.sectionid, markingPeriods[1].MarkingPeriodId);

            let q1GradeString = q1info[0]?.SectionGrade;
            let q2GradeString = q2info[0]?.SectionGrade;

            q1GradeString ??= "100";

            let doesNotHaveQ2Grade = false;
            if (!q2GradeString) {
                q2GradeString = q1GradeString;
                doesNotHaveQ2Grade = true;
            }

            const row = createEl("tr");
            body.append(row);

            const name = c.sectionidentifier;
            const type: ClassType = ClassType.fromName(name);

            row.dataset.classType = type.id.toString();
            row.dataset.hasGrade = (q1GradeString !== null).toString();

            const grades = {
                [GradePeriod.Q1]: new Grade(parseFloat(q1GradeString)),
                [GradePeriod.Q2]: new Grade(parseFloat(q2GradeString)),
                [GradePeriod.EXAM]: null as Grade,
                [GradePeriod.OVERALL]: null as Grade,
            };
            grades[GradePeriod.EXAM] = new Grade(
                (grades[GradePeriod.Q1].percentage + grades[GradePeriod.Q2].percentage) / 2
            );
            grades[GradePeriod.OVERALL] = type.calculateOverallGrade(
                grades[GradePeriod.Q1],
                grades[GradePeriod.Q2],
                grades[GradePeriod.EXAM]
            );

            const els = [
                createEl("th", ["col-md-4"], shortenClassName(name)),
                createEl("th", ["col-md-1"], grades[GradePeriod.Q1].getNumbers(), {
                    "contentEditable": "true",
                    "data-grade-type": GradePeriod.Q1,
                }),
                createEl("th", ["col-md-1"], grades[GradePeriod.Q2].getNumbers(), {
                    "contentEditable": "true",
                    "data-grade-type": GradePeriod.Q2,
                }),
                createEl("th", ["col-md-1"], grades[GradePeriod.EXAM].getNumbers(), {
                    "contentEditable": "true",
                    "data-grade-type": GradePeriod.EXAM,
                }),
                createEl("th", ["col-md-1", "table-gpa-source"], grades[GradePeriod.OVERALL].getNumbers(), {
                    "contentEditable": "true",
                    "data-grade-type": GradePeriod.OVERALL,
                }),
                createEl("th", ["col-md-1"], grades[GradePeriod.OVERALL].toString(), {
                    contentEditable: "true",
                }),
                // Add some stuff so the formula dropdown can change it
                createEl(
                    "th",
                    ["col-md-1", "table-gpa"],
                    getCurrentGPAFormula().calc(grades[GradePeriod.OVERALL], type).toFixed(2)
                ),
            ];

            if (doesNotHaveQ2Grade) {
                addToolTip(els[2], "This grade is not in yet, so it is the same as the quarter before");
            }

            addToolTip(els[3], "This is an average of your 2 quarter grades");

            row.append(...els);

            // q1, q2, exam affect output
            for (let i = 1; i < 4; i++) {
                const el = els[i];

                selectElementOnFocus(el);

                el.addEventListener("blur", e => {
                    if (Number.isNaN(parseFloat(el.innerHTML))) {
                        console.error("could not set grade");
                        return;
                    }

                    const [_, q1Element, q2Element, examElement, overallElement, gradeElement, gpaElement] =
                        el.parentElement.children as any as HTMLDivElement[];
                    grades[el.dataset.gradeType] = new Grade(parseFloat(el.innerHTML));
                    grades[GradePeriod.OVERALL] = type.calculateOverallGrade(
                        grades[GradePeriod.Q1],
                        grades[GradePeriod.Q2],
                        grades[GradePeriod.EXAM]
                    );

                    overallElement.innerHTML = grades[GradePeriod.OVERALL].getNumbers();
                    gradeElement.innerHTML = grades[GradePeriod.OVERALL].toString();

                    el.innerHTML = grades[el.dataset.gradeType].getNumbers();
                    removeToolTip(el);
                    removeToolTip(overallElement);
                });
            }

            // output effects exam
            const examEl = els[3];
            const overallEl = els[4];
            const gpaEl = els[6];
            selectElementOnFocus(overallEl);
            // overallEl.addEventListener("focus", () => {
            //     selectContentEditableElement(overallEl);
            // });
            overallEl.addEventListener("blur", () => {
                if (Number.isNaN(parseFloat(overallEl.innerHTML))) {
                    console.error("could not set grade");
                }

                grades[GradePeriod.OVERALL] = new Grade(parseFloat(overallEl.innerHTML));
                grades[GradePeriod.EXAM] = new Grade(
                    getExamGradeForOverall(
                        grades[GradePeriod.OVERALL].percentage,
                        grades[GradePeriod.Q1].percentage,
                        grades[GradePeriod.Q2].percentage
                    )
                );

                overallEl.innerHTML = grades[GradePeriod.OVERALL].getNumbers();
                gpaEl.dataset.rawGrade = grades[GradePeriod.OVERALL].percentage.toString();

                rerenderAllGPAs();

                examEl.innerHTML = grades[GradePeriod.EXAM].getNumbers();
                markEl.innerHTML = grades[GradePeriod.OVERALL].toString();

                addToolTip(
                    examEl,
                    `<u>${grades[
                        GradePeriod.EXAM
                    ].getNumbers()}</u> is the minimum exam grade to get a <u>${grades[
                        GradePeriod.OVERALL
                    ].getNumbers()}</u>`
                );

                removeToolTip(overallEl);
            });

            // letter grade effects overall
            const markEl = els[5];
            // markEl.addEventListener("focus", () => {
            //     selectContentEditableElement(markEl);
            // });
            selectElementOnFocus(markEl);
            markEl.addEventListener("blur", () => {
                grades[GradePeriod.OVERALL] = Grade.parseGrade(markEl.innerHTML);

                overallEl.innerHTML = grades[GradePeriod.OVERALL].getNumbers();

                // Quickly focus and blur the overallEl to sync changes
                overallEl.focus();
                overallEl.blur();

                addToolTip(
                    overallEl,
                    `<u>${grades[
                        GradePeriod.OVERALL
                    ].getNumbers()}</u> is the minimum grade needed to get an <u>${grades[
                        GradePeriod.OVERALL
                    ].toString()}</u>`
                );
            });
        })
    );

    const unmarkedRow = createEl("tr");
    table.append(unmarkedRow);

    const unmarkedCol = createEl(
        "th",
        ["muted"],
        "",
        { colspan: "7", id: "gpa-table-footer-text" },
        { textAlign: "center" }
    );
    unmarkedRow.append(unmarkedCol);

    rerenderAllGPAs();

    return table;
}
