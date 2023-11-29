import { AssignmentInfo } from "../../../api/assignments";
import { EnrichedAssignment } from "./enriched_info";

export function closeEnoughForEc(actual: number, calculated: number) {
    return Math.abs(actual - calculated) < 0.01;
}

export function findExtraCredit(assignments: EnrichedAssignment[]) {
    const actual = parseFloat(assignments[0].Percentage) / 100;

    const acquired = assignments.reduce((prev, assignment) => prev + parseFloat(assignment.Points), 0);
    const max = assignments.reduce((prev, assignment) => prev + assignment.MaxPoints, 0);

    const alreadyEc = assignments.filter(a => a.extraCredit);
    assignments = assignments.filter(a => !a.extraCredit);
    const pointsFromEc = alreadyEc.reduce((prev, a) => a.MaxPoints + prev, 0);

    /*
        actual = acquired / (max - ec)
        max - ec = acquired / actual
        -ec = acquired / actual - max

        ec = max - acquired / actual
    */

    const ecPoints = max - acquired / actual - pointsFromEc;

    // Get rid of any assignments bigger than this many points
    const possibleEcAssignments = assignments.filter(a => a.MaxPoints <= ecPoints);

    // First check for one assignment with that many points. If its there return it:
    const singleEC = possibleEcAssignments.find(a => closeEnoughForEc(a.MaxPoints, ecPoints));
    if (singleEC) return [singleEC];

    // Now check for combinations
    const combinations = getCombinations(possibleEcAssignments);
    console.log(
        combinations.map(c => c.reduce((prev, a) => prev + a.MaxPoints, 0) - ecPoints),
        combinations
    );

    // debugger;
    const manyEc = combinations.find(c =>
        closeEnoughForEc(
            ecPoints,
            c.reduce((prev, a) => prev + a.MaxPoints, 0)
        )
    );
    if (manyEc) return manyEc;
    return [];

    console.log("Couldn't find EC");
}

// https://stackoverflow.com/a/59942031
function getCombinations<T>(valuesArray: T[]): T[][] {
    const combi = [];
    let temp = [];
    const slent = Math.pow(2, valuesArray.length);

    for (let i = 0; i < slent; i++) {
        temp = [];
        for (let j = 0; j < valuesArray.length; j++) {
            if (i & Math.pow(2, j)) {
                temp.push(valuesArray[j]);
            }
        }
        if (temp.length > 0) {
            combi.push(temp);
        }
    }

    // combi.sort((a, b) => a.length - b.length);
    return combi;
}
