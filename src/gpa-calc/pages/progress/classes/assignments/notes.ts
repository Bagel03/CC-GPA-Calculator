// Render the "extra credit" and "Dropped" extra notes

import { assignmentInfo, fetchAssignments, fetchAssignmentsBySection } from "../../../../api/assignments";
import { getCurrentMarkingPeriod } from "../../../../api/marking_period";
import { createEl } from "../../../../utils/elements";
import { addToolTip } from "../../../../utils/tooltip";
import { getSectionWeightsAndInfo } from "../weights";

export async function renderNotes(classId: string) {
    const info = await getSectionWeightsAndInfo(classId);
    const assignments = await fetchAssignmentsBySection(classId, await getCurrentMarkingPeriod());

    for (const [section, sectionAssignments] of assignments) {
        const numDroppedAssignments = 1; // info.droppedAssignments[section] || 0;

        const droppedAssignments: assignmentInfo[] = [];
        for (let i = 0; i < numDroppedAssignments; i++) {
            const lowestGrade = sectionAssignments.reduce(
                (prev, curr) => Math.min(prev, parseFloat(curr.Percentage)),
                Infinity
            );

            droppedAssignments.push(
                sectionAssignments.find(assignment => parseFloat(assignment.Percentage) === lowestGrade)
            );
        }

        const element = document.getElementById(section.toString());
        const table = element.nextElementSibling;
        const tableBody = table.getElementsByTagName("tbody")[0];
        const rows = Array.from(tableBody.getElementsByTagName("tr"));

        for (const dropped of droppedAssignments) {
            const row = rows.find(
                row => row.firstElementChild.textContent === dropped.AssignmentShortDescription
            );
            if (row.children[4].textContent.length) row.children[4].appendChild(createEl("br"));

            const span = createEl("span", [], "Currently dropped");
            row.children[4].appendChild(span);
            addToolTip(
                span,
                numDroppedAssignments === 1
                    ? "This is the lowest graded assignment in this section"
                    : `This is one of the ${numDroppedAssignments} lowest graded assginemtns in this section`
            );
        }
    }
}
