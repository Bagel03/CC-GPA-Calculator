import { fetchClassInfo } from "../../../api/class_info.js";
import { getCurrentMarkingPeriod } from "../../../api/marking_period.js";
import { getSettings, saveSettings } from "../../../utils/settings.js";

export const TOTAL_POINTS = "TOTAL_POINTS" as const;
export type TOTAL_POINTS = typeof TOTAL_POINTS;

export const WEIGHTED = "WEIGHTED" as const;
export type WEIGHTED = typeof WEIGHTED;

export type sectionInfo = {
    weights: Record<number, number> | TOTAL_POINTS;
    droppedAssignments: Record<number, number>;
};

export async function getSectionWeightsAndInfo(
    classId: string
): Promise<sectionInfo> {
    const classData = await fetchClassInfo(
        classId,
        await getCurrentMarkingPeriod()
    );
    if (!classData.length) return;

    getSettings().classes[classId] ??= {
        type: null,
        sectionInfo: {},
        gradeFormula: null,
    };
    const settings = getSettings().classes[classId].sectionInfo;

    let weights: Record<number, number> | TOTAL_POINTS = {};

    for (const { AssignmentTypeId, Weight } of classData) {
        weights[AssignmentTypeId] = Weight;
        settings[AssignmentTypeId] ??= {} as any;
    }

    const sections = Object.keys(weights);

    if (classData[0].Weight == null) weights = TOTAL_POINTS; // Total points class

    // Add dropped assignments
    const droppedAssignments: Record<number, number> = {};
    for (const section of sections) {
        droppedAssignments[section] = settings[section].droppedAssignments || 0;
        settings[section].droppedAssignments = droppedAssignments[section];
    }

    saveSettings();

    return { weights, droppedAssignments };
}
