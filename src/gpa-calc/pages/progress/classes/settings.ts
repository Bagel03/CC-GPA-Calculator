import { fetchAssignments } from "../../../api/assignments";
import { getCurrentMarkingPeriod } from "../../../api/marking_period";
import { ClassType } from "../../../grades/class_type";
import { GradePeriod, getNiceNameForGradePeriod } from "../../../grades/exams";
import { createEl } from "../../../utils/elements";
import { setModalHeight } from "../../../utils/modal_height";
import { selectContentEditableElement, selectElementOnFocus } from "../../../utils/select";
import { getSettings, saveSettings } from "../../../utils/settings";
import { shortenClassName } from "../../../utils/shorten_class";
import { addToolTip } from "../../../utils/tooltip";
import { TOTAL_POINTS, WEIGHTED, getSectionWeightsAndInfo } from "./weights";

export async function getClassSettingsBody(classID: string, className: string) {
    const classSettings = (getSettings().classes[classID] ??= {
        sectionInfo: {},
        type: ClassType.fromName(className).id,
        gradeFormula: TOTAL_POINTS,
    });

    const sectionInfo = (await getSectionWeightsAndInfo(classID)) || {
        weights: TOTAL_POINTS,
        droppedAssignments: {},
        extraCreditAssignments: {},
    };
    const classInfo = await fetchAssignments(classID, await getCurrentMarkingPeriod());

    classSettings.type = ClassType.fromName(className).id;
    classSettings.sectionInfo ??= {};

    const isTotalPoints = sectionInfo.weights === TOTAL_POINTS;
    classSettings.gradeFormula ??= isTotalPoints ? TOTAL_POINTS : WEIGHTED;

    const body = createEl("div", ["modal-body"], "", {}, { overflowY: "scroll" });

    const sectionTitle = createEl("div", [], `<h1 style="margin-top: 0">${shortenClassName(className)}</h1>`);
    const hr = createEl("hr", ["margin-5"]);
    body.append(sectionTitle, hr);

    const classOptionsTitle = createEl("div", [], "<h3>Class Options</h3>");
    body.append(classOptionsTitle);
    const classTypeRow = createEl(
        "div",
        ["row"],
        `<strong>Class Type:&nbsp</strong>`,
        {},
        { paddingLeft: "30px" }
    );

    const gradingSystemRow = createEl(
        "div",
        ["row"],
        `<strong>Grading System:&nbsp</strong>`,
        {},
        { paddingLeft: "30px" }
    );

    const changeClassTypeBtn = createEl(
        "button",
        ["btn", "btn-default", "dropdown-toggle"],
        ``,
        { "data-toggle": "dropdown" },
        { width: "120px" }
    );
    const classTypeDropdown = createEl(
        "ul",
        ["dropdown-menu"],
        ClassType.types
            .map(
                c => `
            <li>
                <a data-class-type="${c.id}">${c.name}</a>
            </li>
        `
            )
            .join("")
    );

    const correctClassTypeLink = classTypeDropdown.querySelector(`[data-class-type="${classSettings.type}"]`);
    correctClassTypeLink.classList.add("active");
    changeClassTypeBtn.innerHTML = `${correctClassTypeLink.innerHTML} <span class="caret"></span>`;

    const classTypeDropdownGroup = createEl(
        "div",
        ["btn", "btn-group"],
        "",
        {},
        { padding: "0", margin: " 0 15px" }
    );

    classTypeDropdownGroup.append(classTypeDropdown, changeClassTypeBtn);

    classTypeRow.append(classTypeDropdownGroup);

    const changeGradingSystemBtn = createEl(
        "button",
        ["btn", "btn-default", "dropdown-toggle"],
        `${isTotalPoints ? "Total Points" : "Weighted"} <span class="caret"></span>`,
        { "data-toggle": "dropdown" },
        { width: "120px" }
    );
    const gradingSystemDropdown = createEl(
        "ul",
        ["dropdown-menu"],
        `
            <li class="${isTotalPoints ? "active" : ""}">
                <a data-grading-system="${TOTAL_POINTS}">Total points</a>
            </li>           
            <li class="${isTotalPoints ? "" : "active"}">
                <a data-grading-system="${WEIGHTED}">Weighted</a>
            </li>
        `
    );
    const gradingSystemDropdownGroup = createEl(
        "div",
        ["btn", "btn-group"],
        "",
        {},
        { padding: "0", margin: "15px" }
    );

    gradingSystemDropdownGroup.append(gradingSystemDropdown, changeGradingSystemBtn);

    gradingSystemRow.append(gradingSystemDropdownGroup);
    body.append(classTypeRow, gradingSystemRow);

    [classTypeDropdown, gradingSystemDropdown].forEach(dropdown => {
        dropdown.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", function () {
                dropdown.querySelector(".active").classList.remove("active");
                this.parentElement.classList.add("active");
                dropdown.parentElement.lastElementChild.innerHTML = `${link.innerHTML} <span class="caret"></span>`;
            });
        });
    });

    classTypeDropdown.querySelectorAll("a").forEach(link =>
        link.addEventListener("click", function () {
            classSettings.type = ClassType.getById(parseInt(link.dataset.classType)).id; //parseInt(link.dataset.classType) as ClassType;
        })
    );

    gradingSystemDropdown.querySelectorAll("a").forEach(link =>
        link.addEventListener("click", function () {
            classSettings.gradeFormula = link.dataset.gradingFormula as TOTAL_POINTS | WEIGHTED;
        })
    );

    // Categories
    {
        const categoriesTitle = createEl("div", [], "<h3>Categories</h3>");
        body.append(categoriesTitle);
        const table = createEl(
            "table",
            ["table", "table-striped", "table-condensed", "table-mobile-stacked"],
            ""
        );

        const head = createEl("thead");
        table.append(head);
        const headRow = createEl("tr");
        head.append(headRow);

        const tbody = createEl("tbody");
        table.append(tbody);

        headRow.append(
            createEl("th", [], "Category"),
            createEl("th", [], "Weight"),
            createEl("th", [], "Dropped")
        );

        for (const sectionId of Object.keys(sectionInfo.droppedAssignments)) {
            const sectionName: string = classInfo.find(
                assignment => assignment.AssignmentTypeId.toString() == sectionId
            ).AssignmentType;

            const row = createEl("tr");
            tbody.append(row);

            const els = [
                createEl("td", ["col-md-5"], sectionName),
                createEl("td", ["col-md-2"], "", {
                    "data-linked-section-weight": sectionId,
                }),
                createEl("td", ["col-md-2"], sectionInfo.droppedAssignments[sectionId], {
                    "data-linked-section-dropped": sectionId,
                    "contentEditable": "true",
                }),
            ];

            if (sectionInfo.weights === TOTAL_POINTS) {
                els[1].innerHTML = "N/A";
                addToolTip(els[1], "Total points classes don't have category weights");
            } else {
                els[1].innerHTML = sectionInfo.weights[sectionId] + `<span class="muted">%</span>`;
            }

            row.append(...els);

            selectElementOnFocus(els[2]);
            // els[2].addEventListener("focus", function () {
            //     selectContentEditableElement(els[2]);
            // });
            els[2].addEventListener("blur", function () {
                const num = parseInt(els[2].innerHTML);

                if (Number.isNaN(num)) {
                    els[2].innerHTML = "0";
                    return;
                }

                classSettings.sectionInfo[sectionId as any].droppedAssignments = num;
                saveSettings();
            });
        }

        body.append(table);
    }

    // Semester Weighting
    {
        const examWeightingTitle = createEl("div", [], "<h3>Semester Weighting</h3>");
        body.append(examWeightingTitle);
        const table = createEl(
            "table",
            ["table", "table-striped", "table-condensed", "table-mobile-stacked"],
            ""
        );

        const head = createEl("thead");
        table.append(head);
        const headRow = createEl("tr");
        head.append(headRow);

        const tbody = createEl("tbody");
        table.append(tbody);

        headRow.append(createEl("th", [], "Time Period"), createEl("th", [], "Weight"));

        for (const timePeriod of [GradePeriod.Q1, GradePeriod.Q2, GradePeriod.EXAM]) {
            const row = createEl("tr");
            tbody.append(row);

            const els = [
                createEl("td", ["col-md-7"], getNiceNameForGradePeriod(timePeriod)),

                createEl(
                    "td",
                    ["col-md-2"],
                    `${timePeriod == GradePeriod.EXAM ? "20" : "40"}<span class="muted">%</span>`
                ),
            ];
            row.append(...els);
        }

        body.append(table);
    }

    return body;
}

export async function renderClassSettings(classId: string) {
    const oldHeaderTextEl = document.getElementsByClassName("bb-dialog-header")[0];
    const oldBody = document.getElementsByClassName("modal-body")[0];
    const oldFooter = document.getElementsByClassName("modal-footer")[0];

    const oldText = oldHeaderTextEl.innerHTML;
    oldHeaderTextEl.innerHTML = "CC GPA Calculator Settings";

    const newFooter = createEl("div", ["modal-footer"]);
    const closeSettingsBtn = createEl(
        "button",
        ["btn", "btn-default"],
        `Close Settings`,
        {},
        { float: "right" }
    );

    const lastBtn = createEl("button", ["btn", "btn-default", "disabled"], "Last Class");
    const nextBtn = createEl("button", ["btn", "btn-default", "disabled"], "Next Class");

    newFooter.append(lastBtn, nextBtn, closeSettingsBtn);
    oldFooter.replaceWith(newFooter);

    const newBody = await getClassSettingsBody(classId, oldText);
    oldBody.replaceWith(newBody);

    setModalHeight();
    closeSettingsBtn.addEventListener("click", () => {
        newBody.replaceWith(oldBody);
        newFooter.replaceWith(oldFooter);
        oldHeaderTextEl.innerHTML = oldText;
        setModalHeight();
    });
}
