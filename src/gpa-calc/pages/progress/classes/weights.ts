import { fetchAssignments } from "../../../api/assignments.js";
import { getCurrentMarkingPeriod } from "../../../api/marking_period.js";
import { getCombinations } from "../../../utils/combinations.js";
import { getSettings, saveSettings } from "../../../utils/settings.js";

export const TOTAL_POINTS = "TOTAL_POINTS" as const;
export type TOTAL_POINTS = typeof TOTAL_POINTS;

export const WEIGHTED = "WEIGHTED" as const;
export type WEIGHTED = typeof WEIGHTED;

export type sectionInfo = {
    weights: Record<string, number> | TOTAL_POINTS;
    droppedAssignments: Record<string, number>;
    extraCreditAssignments: Record<string, number[]>;
};

export async function getSectionWeightsAndInfo(classId: string): Promise<sectionInfo> {
    const classData = await fetchAssignments(classId, await getCurrentMarkingPeriod());
    if (!classData.length) return;

    getSettings().classes[classId] ??= {
        type: null,
        sectionInfo: {},
        gradeFormula: null,
    };
    const settings = getSettings().classes[classId].sectionInfo;

    let weights: Record<string, number> | TOTAL_POINTS = {};

    for (const { AssignmentTypeId, Weight } of classData) {
        weights[AssignmentTypeId] = Weight;
        settings[AssignmentTypeId] ??= {} as any;
    }

    const sections = Object.keys(weights);

    if (classData[0].Weight == null) weights = TOTAL_POINTS; // Total points class

    // Add dropped assignments & extra credit assingments
    const extraCreditAssignments: Record<string, number[]> = {};
    const droppedAssignments: Record<string, number> = {};

    for (const section of sections) {
        droppedAssignments[section] = settings[section].droppedAssignments || 0;
        settings[section].droppedAssignments = droppedAssignments[section];

        extraCreditAssignments[section] = settings[section].extraCreditAssingments || [];
        settings[section].extraCreditAssingments = extraCreditAssignments[section];
    }

    saveSettings();

    return { weights, droppedAssignments, extraCreditAssignments };
}

/*
    Most unmarked extra credit things are similar to 2/2 or 1/1, so to identify those we look to see how many points we have to take off the total
    if we want it to equal the given grade, 
*/
export function identifyAnyPossibleExtraCredit(
    assingments: Record<string, { points: number; max: number }>,
    grade: number,
    droppedAssignments: number
): string[] {
    let assingmentsMap = Object.entries(assingments);

    while (droppedAssignments > 0) {
        const min = assingmentsMap.reduce(
            (prevMin, [_, { points, max }]) => Math.min(prevMin, points / max),
            -Infinity
        );
        assingmentsMap.splice(assingmentsMap.findIndex(([_, { points, max }]) => points / max === min)!, 1);
    }

    let [totalPoints, maxPoints] = assingmentsMap.reduce(
        ([prevPoints, prevTotal], [_, { points, max }]) => [prevPoints + points, prevTotal + max],
        [0, 0]
    );

    // total / x = grade
    // total = grade (x)
    // x= total / grade

    const desiredMaxPoints = totalPoints / grade;
    const lookingForAssignmentWorth = maxPoints - desiredMaxPoints;

    // first look for one assignment
    for (const [id, { points, max }] of assingmentsMap) {
        if (max === lookingForAssignmentWorth) return [id];
    }

    // Now look for a combination of assingments
    const assignmentsWithLessThanDesired = assingmentsMap.filter(x => x[1].max <= lookingForAssignmentWorth);
    const combinatoins = getCombinations(assignmentsWithLessThanDesired);

    return combinatoins
        .find(arg => arg.reduce((prev, curr) => curr[1].max + prev, 0) === lookingForAssignmentWorth)
        ?.map(x => x[0]);
}
