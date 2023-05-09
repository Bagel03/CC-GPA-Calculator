// Renders the percentage of each category

import { fetchClassInfo } from "../../../api/class_info.js";
import { getCurrentMarkingPeriod } from "../../../api/marking_period.js";
import { createEl } from "../../../utils/elements.js";

export async function renderClassPercentage(classId: string) {
    const classData = await fetchClassInfo(classId, await getCurrentMarkingPeriod());
    if (!classData.length) return;
    if (classData[0].Weight == null) return; // Total points class

    const weights = new Map<number, number>();

    for (const assignment of classData) {
        weights.set(assignment.AssignmentTypeId, assignment.Weight);
    }

    weights.forEach((percent, id) => {
        const el = document.querySelector(`[data-bookmark="#${id}"]`).children[1];
        el.appendChild(createEl("span", [], ` (${percent}% overall)`));
    })
}