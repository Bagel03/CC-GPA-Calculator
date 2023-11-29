import { createEl } from "../../../../utils/elements";
import { getHTMLTextContent } from "../../../../utils/fix_name";
import { selectElementOnFocus } from "../../../../utils/select";
import { getSettings, saveSettings } from "../../../../utils/settings";
import { getEnrichedAssignments } from "../enriched_info";
import { getSectionWeightsAndInfo } from "../weights";
import { recalculateGrade } from "./recalc";

type assignmentInfo = {
    index: number;
    score: number;
    max: number;
};

export function hideSettings() {
    for (const el of document.querySelectorAll<HTMLElement>(".gpa-settings")) {
        el.hidden = true;
    }

    document.getElementById("gpa-settings-toggle")!.innerText = "GPA Calculator Settings...";
}

export function showSettings() {
    for (const el of document.querySelectorAll<HTMLElement>(".gpa-settings")) {
        el.hidden = false;
    }
    document.getElementById("gpa-settings-toggle")!.innerText = "Hide GPA Calculator Settings";
    // document
    //     .querySelector(".modal-body")
    //     .scrollIntoView({document.getElementById("gpa-settings-table-header")!});
    document.getElementById("gpa-settings-table-header")!.scrollIntoView({ behavior: "smooth" });
}

export function toggleSettings() {
    const el = document.querySelector<HTMLElement>(".gpa-settings");
    if (el.hidden) showSettings();
    else hideSettings();
}

export async function appendExtraCreditInfo(classID: string) {
    const assignments = await getEnrichedAssignments(classID);
    const info = await getSectionWeightsAndInfo(classID);

    for (const [section, sectionAssignments] of Object.entries(assignments)) {
        const sectionTitleBar = document.getElementById(section);
        const table = sectionTitleBar.nextElementSibling as HTMLTableElement;

        const headerRow = table.querySelector("thead > tr");
        headerRow.prepend(createEl("th", ["gpa-settings"], "E.C.?"));

        for (const assignment of sectionAssignments) {
            const assignmentRow = Array.from<HTMLTableRowElement>(
                table.lastElementChild.children as any
            ).find(
                child =>
                    child.firstElementChild.textContent ==
                    // The server likes to send odd stuff (#&160 and <br /> instead of &nbsp and <br>)
                    getHTMLTextContent(assignment.AssignmentShortDescription)
            );

            const td = createEl("td", ["gpa-settings"], "", {}, { width: "15px", textAlign: "center" });
            if (!assignmentRow) debugger;
            assignmentRow.prepend(td);
            const input = createEl(
                "input",
                ["gpa-settings"],
                "",
                {
                    type: "checkbox",
                    onclick: () => {
                        const extraCreditArr =
                            getSettings().classes[classID].sectionInfo[section].extraCreditAssignments;

                        getSettings().classes[classID].sectionInfo[section].dontLookForExtraCredit = false;

                        if (!input.checked) {
                            // remove it rn
                            extraCreditArr.splice(extraCreditArr.indexOf(assignment.AssignmentId));
                        } else {
                            extraCreditArr.push(assignment.AssignmentId);
                        }

                        saveSettings();
                        // TODO: re-render grades and stuff
                        recalculateGrade(classID);
                    },
                },
                { margin: "auto" }
            );
            td.appendChild(input);

            if (assignment.extraCredit) {
                input.checked = true;
            }
            //     assignmentRow.lastElementChild.innerHTML += "Extra Credit";
            // }

            // if (assignment.dropped) {
            //     assignmentRow.lastElementChild.innerHTML += "Currently dropped";
            // }
        }

        // Bottom settings bar (preceentage + dropped assignments)
        // const bottomRow = createEl("tr", ["gpa-settings"]);
        // const els = [
        //     createEl("td", ["gpa-settings"], "Section Weight: "),
        //     createEl("td", ["gpa-settings"], info.weights === "TOTAL_POINTS" ? "N/A" : info.weights[section].toString()),
        //     createEl("td", ["gpa-settings"], "Class Percentage: "),
        //     createEl("td", ["gpa-settings"], "Class Percentage: "),
        // ];
    }

    appendExtraNotes(classID);

    const settingsTitleBarContainer = createEl("div", ["gpa-settings"], "", {
        id: "gpa-settings-table-header",
    });
    document.getElementById("chart").insertAdjacentElement("afterend", settingsTitleBarContainer);

    const settingsTitleBar = createEl("h3", [], `GPA Calculator Settings `);
    const closeSpan = createEl("span", ["muted"], "(");
    settingsTitleBar.append(closeSpan);
    const closeLink = createEl("a", ["cursor-pointer"], "hide", { onclick: hideSettings });
    closeSpan.append(closeLink);
    closeSpan.append(")");

    settingsTitleBarContainer.append(settingsTitleBar);

    const settingsTable = createEl("table", [
        "table",
        "table-striped",
        "table-condensed",
        "table-mobile-stacked",
        "gpa-settings",
    ]);
    // table table-striped table-condensed table-mobile-stacked
    const settingsTableHead = createEl("thead");
    const settingsTableHeadRow = createEl("tr");
    settingsTableHead.append(settingsTableHeadRow);

    settingsTable.append(settingsTableHead);
    settingsTitleBarContainer.insertAdjacentElement("afterend", settingsTable);

    settingsTableHeadRow.append(
        createEl("th", ["col-md-6"], "Section"),
        createEl("th", ["col-md-3"], "Weight"),
        createEl("th", ["col-md-3"], "Dropped Assignments")
    );

    const tableBody = createEl("tbody");
    settingsTable.append(tableBody);

    for (const section of Object.keys(info.droppedAssignments)) {
        const row = createEl("tr");
        tableBody.append(row);
        row.append(
            createEl("td", [], info.names[section]),
            createEl(
                "td",
                [],
                info.weights === "TOTAL_POINTS" ? "N/A" : info.weights[section].toString() + "%"
            ),
            createEl("td", [], info.droppedAssignments[section].toString(), { contentEditable: true })
        );

        const [nameEl, weightEl, droppedEl] = row.children as any as HTMLElement[];

        selectElementOnFocus(droppedEl);
        droppedEl.addEventListener("blur", function () {
            const numDropped = parseInt(droppedEl.innerText);
            if (Number.isNaN(numDropped)) return;

            info.droppedAssignments[section] = numDropped;
            saveSettings();
            recalculateGrade(classID);
            // appendExtraNotes(classID);
        });
    }

    for (const el of document.querySelectorAll<HTMLElement>(".gpa-settings")) {
        el.hidden = true;
    }

    return;
}

export async function appendExtraNotes(classId: string) {
    document.querySelectorAll(".gpa-assignment-extra-info").forEach(e => e.remove());

    const info = await getSectionWeightsAndInfo(classId);

    for (const [sectionId, numDropped] of Object.entries(info.droppedAssignments)) {
        const table = document.getElementById(sectionId).nextElementSibling;

        const droppedAssignmentRows: HTMLTableRowElement[] = [];
        for (let i = 0; i < numDropped; i++) {
            let minrow;
            let minPercent = Infinity;

            for (const grade of table.querySelectorAll(
                `[data-heading="Points"]`
            ) as NodeListOf<HTMLDivElement>) {
                if (droppedAssignmentRows.includes(grade.parentElement as any)) continue;

                const [score, maxPoints] = grade.innerText.split("/").map(x => parseFloat(x));
                if (score / maxPoints < minPercent) {
                    minPercent = score / maxPoints;
                    minrow = grade.parentElement;
                }
            }

            droppedAssignmentRows.push(minrow);
        }

        for (const row of table.lastElementChild.children as any as NodeListOf<HTMLTableRowElement>) {
            const lastEl = row.lastElementChild;
            const checkBox = row.firstElementChild.firstElementChild as HTMLInputElement;
            console.log(row.children[1].textContent, checkBox.checked);
            const extraInfoEl = createEl("span", ["gpa-assignment-extra-info"]);
            if (checkBox.checked) {
                extraInfoEl.append("Extra credit");
            }
            if (droppedAssignmentRows.includes(row)) {
                extraInfoEl.append("Currently dropped");
            }

            if (extraInfoEl.textContent !== "") {
                if (lastEl.textContent !== "") {
                    lastEl.append(" ");
                }
                lastEl.appendChild(extraInfoEl);
            }
        }
    }
}
