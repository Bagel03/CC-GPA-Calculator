import { clamp, mapRange } from "../utils/num.js";
import { ClassType } from "./class_type.js";
import { GpaFormula } from "./gpa.js";
/*
Letter Numerical Academic Honors / Advanced
Grade Grade Courses Courses
A+ 100 - 97 4.33 5.33
A 96 - 93 4.00 5.00
A- 92 - 90 3.67 4.67
B+ 89 - 87 3.33 4.33
B 86 - 83 3.00 4.00
B- 82 - 80 2.67 3.67
C+ 79 - 77 2.33 3.33
C 76 - 73 2.00 3.00
C- 72 - 70 1.67 2.67
D+ 69 - 67 1.33 2.33
D 66 - 63 1.00 2.00
D- 62 - 60 0.67 1.67
F Below 60 0.00 0.00
*/

export const LetterGrade = {
    A: "A",
    B: "B",
    C: "C",
    D: "D",
    F: "F",
} as const;
export type LetterGrade = keyof typeof LetterGrade;

export const GradeModifier = {
    PLUS: "+",
    MINUS: "-",
    NONE: "",
} as const;
export type GradeModifier = (typeof GradeModifier)[keyof typeof GradeModifier];

export class Grade {
    public static readonly lettersToGrades: [LetterGrade, number][] = [
        [LetterGrade.A, 90],
        [LetterGrade.B, 80],
        [LetterGrade.C, 70],
        [LetterGrade.D, 60],
        [LetterGrade.F, 0],
    ];

    public static readonly lettersToGPA: Record<LetterGrade, number> = {
        [LetterGrade.A]: 4,
        [LetterGrade.B]: 3,
        [LetterGrade.C]: 2,
        [LetterGrade.D]: 1,
        [LetterGrade.F]: 0,
    };

    public static readonly modifiersToGrades: [GradeModifier, number][] = [
        [GradeModifier.PLUS, 7],
        [GradeModifier.NONE, 3],
        [GradeModifier.MINUS, 0],
    ];

    public static readonly modifiersToGPA: Record<GradeModifier, number> = {
        [GradeModifier.PLUS]: 0.33,
        [GradeModifier.NONE]: 0,
        [GradeModifier.MINUS]: -0.33,
    };

    public readonly letter: LetterGrade;
    public readonly modifier: GradeModifier;

    constructor(public readonly percentage: number) {
        if (percentage <= 60) {
            this.letter = LetterGrade.F;
            this.modifier = GradeModifier.NONE;
        } else if (percentage >= 99.5) {
            this.letter = LetterGrade.A;
            this.modifier = GradeModifier.PLUS;
        } else {
            this.letter = Grade.lettersToGrades.find(
                ([grade, num]) => Math.round(this.percentage) >= num
            )[0];
            this.modifier = Grade.modifiersToGrades.find(
                ([grade, num]) => Math.round(this.percentage) % 10 >= num
            )[0];
        }
    }

    getGPA(classType: ClassType, formula: GpaFormula = GpaFormula.CC) {
        if (classType == ClassType.UNMARKED) {
            console.warn(
                "Tried to get the GPA of a uncounted course. This might give an incorrect average GPA"
            );
            return 0;
        }

        const GPA =
            Grade.lettersToGPA[this.letter] +
            Grade.modifiersToGPA[this.modifier];

        if (formula == GpaFormula.UNWEIGHTED) return GPA;
        if (formula == GpaFormula.UNWEIGHTED_NO_A_PLUS) return Math.min(GPA, 4);

        switch (classType) {
            case ClassType.HONORS:
            case ClassType.AP:
                return GPA + 1;

            case ClassType.REGULAR:
                return GPA;
        }
    }

    toString() {
        return this.letter + this.modifier;
    }

    getNumbers() {
        return this.percentage.toFixed(2) + "%";
    }

    static parseGrade(grade: string) {
        grade = grade.toUpperCase().trim().replaceAll(" ", "");
        const [letter, modifier] = [...grade.split(""), ""];

        let percent = Grade.lettersToGrades.find(([l]) => letter == l)[1];
        percent += Grade.modifiersToGrades.find(([x]) => modifier == x)[1];

        return new Grade(percent - 0.5);
    }
}
