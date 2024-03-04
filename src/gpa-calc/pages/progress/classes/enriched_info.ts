import { AssignmentInfo, fetchAssignments } from "../../../api/assignments";
import { getCurrentMarkingPeriod } from "../../../api/marking_period";
import { getSettings, saveSettings } from "../../../utils/settings";
import { closeEnoughForEc, findExtraCredit } from "./extra_credit";
import { getSectionWeightsAndInfo } from "./weights";

export type EnrichedAssignment = {
    dropped: boolean;
    extraCredit: boolean;

    assignmentPercentage: number;
} & AssignmentInfo;

export async function getEnrichedAssignments(classId: string) {
    const info = await getSectionWeightsAndInfo(classId);
    const assignments = await fetchAssignments(classId);
    const sections = Object.groupBy(assignments, i => i.AssignmentTypeId);

    const result: Record<string, EnrichedAssignment[]> = {};

    for (const [sectionId, sectionAssignments] of Object.entries<EnrichedAssignment[]>(sections as any)) {
        result[sectionId] = [];

        const numDropped = info.droppedAssignments[sectionId];

        for (const assignment of sectionAssignments as EnrichedAssignment[]) {
            result[sectionId].push(assignment as any);

            assignment.extraCredit = info.extraCreditAssignments[sectionId].includes(assignment.AssignmentId);
            assignment.assignmentPercentage = parseFloat(assignment.Points) / assignment.MaxPoints;
        }

        for (let i = 0; i < numDropped; i++) {
            let minVal = Infinity;
            let minIdx = -1;

            sectionAssignments.forEach((assignment, i) => {
                if (assignment.extraCredit) return;
                if (assignment.assignmentPercentage < minVal) {
                    minVal = assignment.assignmentPercentage;
                    minIdx = i;
                }
            });

            sectionAssignments[minIdx].dropped = true;
        }

        const shouldntLookForEc =
            getSettings().classes[classId].sectionInfo[sectionId].dontLookForExtraCredit;
        if (shouldntLookForEc) continue;

        // Do the final check
        let maxPoints = 0;
        let totalPoints = 0;

        for (const assignment of sectionAssignments) {
            if (assignment.dropped) continue;

            maxPoints += assignment.extraCredit ? 0 : assignment.MaxPoints;
            totalPoints += parseFloat(assignment.Points);
        }

        let calculatedScore = (totalPoints / maxPoints) * 100;
        // console.log(calculatedScore.toFixed(2), parseFloat(sectionAssignments[0].Percentage).toFixed(2));
        if (!closeEnoughForEc(calculatedScore, parseFloat(sectionAssignments[0].Percentage))) {
            // Too much extra credit
            getSettings().classes[classId].sectionInfo[sectionId].dontLookForExtraCredit = true;
            saveSettings();

            if (calculatedScore > parseFloat(sectionAssignments[0].Percentage)) {
                if (
                    confirm(
                        `It seems like some assignments may have been marked as extra credit, even if they are not. Was this intentional? 

If so, press "OK" to prevent this dialog from appearing again. If not, press "Cancel" and de-select the erroneous assignments by clicking the "GPA Calculator Settings" link at the bottom of the modal window`
                    )
                ) {
                    // saveSettings();
                    return result;
                } else {
                    setTimeout(() => {
                        getSettings().classes[classId].sectionInfo[sectionId].dontLookForExtraCredit = false;
                        saveSettings();
                    }, 2000);
                    return result;
                }
            }

            console.log("Must be some extra credit missing");
            // const shouldntLookForEc =
            //     getSettings().classes[classId].sectionInfo[sectionId].dontLookForExtraCredit;
            // if (shouldntLookForEc) return;

            const ec = findExtraCredit(sectionAssignments);
            if (
                confirm(
                    `It seems like this class has some extra credit assignments. Are these assignments all th: \n` +
                        ec.map(a => `   - ${a.AssignmentShortDescription}`).join("\n") +
                        `\n\nIf not, press "Cancel" and please select the correct E.C. assignments inside of this class's GPA settings (bottom of the popup)`
                )
            ) {
                ec.forEach(e => (e.extraCredit = true));
                info.extraCreditAssignments[sectionId].push(...ec.map(a => a.AssignmentId));
                // info is a ref to the settings, we should be good to save
                saveSettings();
            } else {
                getSettings().classes[classId].sectionInfo[sectionId].dontLookForExtraCredit = true;
                saveSettings();

                setTimeout(() => {
                    getSettings().classes[classId].sectionInfo[sectionId].dontLookForExtraCredit = false;
                    saveSettings();
                }, 2000);
            }
        }
    }

    return result;
}
