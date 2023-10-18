import { fetchClasses } from "../../../api/classes.js";
import { fetchClassInfo } from "../../../api/class_info.js";
import { fetchMarkingPeriods, getCurrentMarkingPeriod } from "../../../api/marking_period.js";
import { ClassType, getNumberOfClassesOfType } from "../../../grades/class_type.js";
import { getExamGradeForOverall, getOverallGrade, GradePeriod } from "../../../grades/exams.js";
import { Grade } from "../../../grades/grade.js";
import { createEl } from "../../../utils/elements.js";
import { selectContentEditableElement } from "../../../utils/select.js";
import { addToolTip, removeToolTip } from "../../../utils/tooltip.js";
import { getCurrentGPAFormula, rerenderAllGPAs } from "./quarter/footer.js";

export async function renderExamTable(year?: string, duration?: string) {
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
            const q1info = await fetchClassInfo(c.sectionid, markingPeriods[0].MarkingPeriodId);
            const q2info = await fetchClassInfo(c.sectionid, markingPeriods[1].MarkingPeriodId);

            let q1GradeString = q1info[0]?.SectionGrade;
            let q2GradeString = q2info[0]?.SectionGrade;

            q1GradeString ??= "100";

            let doesNotHaveQ2Grade = false;
            if (!q2GradeString) {
                q2GradeString = q1GradeString;
                doesNotHaveQ2Grade = true;
            }

            // console.log(c.sectionidentifier, q1info, q2info)
            // console.log(q1Grade, q2Grade)//q2info[0].SectionGrade)

            const row = createEl("tr");
            body.append(row);

            const name = c.sectionidentifier;
            const type: ClassType = ClassType.fromName(name);
            if (type == ClassType.UNMARKED) return;

            const grades = {
                [GradePeriod.Q1]: new Grade(parseFloat(q1GradeString)),
                [GradePeriod.Q2]: new Grade(parseFloat(q2GradeString)),
                [GradePeriod.EXAM]: null as Grade,
                [GradePeriod.OVERALL]: null as Grade,
            };
            grades[GradePeriod.EXAM] = new Grade(
                (grades[GradePeriod.Q1].percentage + grades[GradePeriod.Q2].percentage) / 2
            );
            grades[GradePeriod.OVERALL] = new Grade(
                getOverallGrade(
                    grades[GradePeriod.Q1].percentage,
                    grades[GradePeriod.Q2].percentage,
                    grades[GradePeriod.EXAM].percentage
                )
            );

            const els = [
                createEl("th", ["col-md-4"], name.replace(/ - [0-9] \(Period [0-9]\)/, "").trim()),
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
                createEl("th", ["col-md-1"], grades[GradePeriod.OVERALL].getNumbers(), {
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
                    getCurrentGPAFormula().calc(grades[GradePeriod.OVERALL], type).toFixed(2),
                    {
                        "data-raw-grade": grades[GradePeriod.OVERALL].percentage.toString(),
                        "data-class-type": type.toString(),
                    }
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

                el.addEventListener("focus", () => {
                    selectContentEditableElement(el);
                });

                el.addEventListener("blur", e => {
                    if (Number.isNaN(parseFloat(el.innerHTML))) {
                        console.error("could not set grade");
                        return;
                    }

                    const [_, q1Element, q2Element, examElement, overallElement, gradeElement, gpaElement] =
                        el.parentElement.children as any as HTMLDivElement[];
                    grades[el.dataset.gradeType] = new Grade(parseFloat(el.innerHTML));
                    grades[GradePeriod.OVERALL] = new Grade(
                        getOverallGrade(
                            grades[GradePeriod.Q1].percentage,
                            grades[GradePeriod.Q2].percentage,
                            grades[GradePeriod.EXAM].percentage
                        )
                    );

                    overallElement.innerHTML = grades[GradePeriod.OVERALL].getNumbers();
                    gradeElement.innerHTML = grades[GradePeriod.OVERALL].toString();

                    removeToolTip(el);
                    // gpaElement.innerHTML = grades[GradePeriod.OVERALL].getGPA();
                });
            }

            // output effects exam
            const examEl = els[3];
            const overallEl = els[4];
            const gpaEl = els[6];
            overallEl.addEventListener("focus", () => {
                selectContentEditableElement(overallEl);
            });
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
            markEl.addEventListener("focus", () => {
                selectContentEditableElement(markEl);
            });

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

    const numUnmarked = getNumberOfClassesOfType(classes, ClassType.UNMARKED);
    if (numUnmarked > 0) {
        const unmarkedRow = createEl("tr");
        table.append(unmarkedRow);
        const unmarkedCol = createEl(
            "th",
            ["muted"],
            `Table does not include ${numUnmarked} unmarked class${numUnmarked > 1 ? "es" : ""}`,
            { colspan: "7" },
            { textAlign: "center" }
        );
        unmarkedRow.append(unmarkedCol);
    }

    rerenderAllGPAs();

    return table;
}
