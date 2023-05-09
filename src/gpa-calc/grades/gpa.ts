import { ClassType, getClassTypeFromName } from "./class_type.js";
import { Grade } from "./grade.js";

export const GpaFormula = {
    CC: 0,
    UNWEIGHTED: 1,
    UNWEIGHTED_NO_A_PLUS: 2,
} as const;
export type GpaFormula = (typeof GpaFormula)[keyof typeof GpaFormula];

export function getNameForGpaFormula(formula: GpaFormula) {
    switch (formula) {
        case GpaFormula.CC:
            return "CC Weighted";
        case GpaFormula.UNWEIGHTED:
            return "Unweighted";
        case GpaFormula.UNWEIGHTED_NO_A_PLUS:
            return "Unweighted (No A+)";
    }
}

export function getAverageGPA(
    classes: any[],
    formula: GpaFormula = GpaFormula.CC
) {
    let grades = classes.map((c) => ({
        grade: new Grade(c.cumgrade),
        name: c.sectionidentifier as string,
    }));
    grades = grades.filter(
        (g) => getClassTypeFromName(g.name) != ClassType.UNMARKED
    );

    return (
        grades.reduce((accum, curr) => {
            return (
                accum +
                curr.grade.getGPA(getClassTypeFromName(curr.name), formula)
            );
        }, 0) / grades.length
    );
}

export function getAverageGPAFromRawData(
    rawData: { grade: Grade; classType: ClassType }[],
    formula: GpaFormula
) {
    return (
        rawData.reduce((accum, curr) => {
            return accum + curr.grade.getGPA(curr.classType, formula);
        }, 0) / rawData.length
    );
}
