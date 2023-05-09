import { fetchClassInfo } from "../../../api/class_info.js";
import { getCurrentMarkingPeriod } from "../../../api/marking_period.js";

export const TOTAL_POINTS = "TOTAL_POINTS" as const;
export type TOTAL_POINTS = typeof TOTAL_POINTS;

export type sectionWeights = TOTAL_POINTS | Map<number, number>;
export async function getSectionWeights(classId: string): Promise<sectionWeights> {
    const classData = await fetchClassInfo(classId, await getCurrentMarkingPeriod());
    if (!classData.length) return;
    if (classData[0].Weight == null) return TOTAL_POINTS; // Total points class

    const weights = new Map<number, number>();

    for (const assignment of classData) {
        weights.set(assignment.AssignmentTypeId, assignment.Weight);
    }
    return weights;
}