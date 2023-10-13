import { ClassType, getClassTypeFromName, getClassTypeName } from "./class_type.js";
import { Grade } from "./grade.js";

interface GpaFormulaOptions {
    inlcudeTheology: boolean,

}
// REGULAR: 0,
// HONORS: 1,
// AP: 2,
// THEOLOGY: 3,
// UNMARKED: 4,

const noTheology = [ClassType.REGULAR, ClassType.HONORS, ClassType.AP];
const allClasses = [...noTheology, ClassType.THEOLOGY];

export class GpaFormula {
    private constructor(
        public readonly name: string,
        public readonly id: number,
        public readonly includedClassTypes: ClassType[],
        public readonly func: (grade: Grade, classType: ClassType) => number
    ) { }

    processesType(classType: ClassType) {
        return this.includedClassTypes.includes(classType);
    }

    getGpaFor(grade: Grade, classType: ClassType) {
        if (!this.includedClassTypes.includes(classType)) {
            console.warn("Tried to get the GPA of a ", getClassTypeName(classType), " class using a(n) ", this.name, "formula. This is not supported and may lead to incorrect results");
            return 0;
        }

        return this.func(grade, classType);
    }

    public static readonly STRAIGHT = new GpaFormula("Straight (4.0)", 5, allClasses, (grade, classType) => Grade.lettersToGPA[grade.letter])
    public static readonly STRAIGHT_NO_THEO = new GpaFormula("Straight (No Theology)", 6, GpaFormula.STRAIGHT.func)

    public static readonly UNWEIGHTED = new GpaFormula("Unweighted (4.33)", 1, allClasses, (grade, classType) => 
    GpaFormula.STRAIGHT.func(grade, classType) + 
    Grade.modifiersToGPA[grade.modifier]
    );
    public static readonly UNWEIGHTED_NO_THEO = new GpaFormula("4.33 Scale (No Theology)", 2, GpaFormula.UNWEIGHTED.func);

    public static readonly UNWEIGHTED_NO_A_PLUS = new GpaFormula("Unweighted w/o A+ (4.0)", 3, allClasses, (grade, classType) => 
        Math.min(
            GpaFormula.UNWEIGHTED.func(grade, classType), 
            4
        ) 
    )
    public static readonly UNWEIGHTED_NO_A_PLUS_OR_THEO = new GpaFormula("4.0 Scale (No Theology)", 4, noTheology, (grade, classType) => GpaFormula.UNWEIGHTED_NO_A_PLUS.func)

    public static readonly CC = new GpaFormula("CC Weighted (5.33)", 0, allClasses, (grade, classType) => 
        GpaFormula.UNWEIGHTED.func(grade, classType) + 
        [ClassType.AP, ClassType.Honors].includes(classType) ? 1 : 0
    );
}

// export const GpaFormula = {
//     CC: 0,
//     UNWEIGHTED: 1,
//     UNWEIGHTED_NO_A_PLUS: 2,
//     STRAIGHT: 3
// } as const;
// export type GpaFormula = (typeof GpaFormula)[keyof typeof GpaFormula];

export function getNameForGpaFormula(formula: GpaFormula) {
    switch (formula) {
        case GpaFormula.CC:
            return "CC Weighted";
        case GpaFormula.UNWEIGHTED:
            return "Unweighted";
        case GpaFormula.UNWEIGHTED_NO_A_PLUS:
            return "Unweighted (No A+)";
        case GpaFormula.STRAIGHT:
            return "Straight"
    }
}

export function getAverageGPA(
    classes: any[],
    formula: GpaFormula = GpaFormula.CC
) {
    let grades = classes
        .filter((c) => c.cumgrade !== null)
        .map((c) => ({
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
