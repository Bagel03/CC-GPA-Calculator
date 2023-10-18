import { ClassType } from "./class_type.js";
import { Grade } from "./grade.js";

export type GpaFormulaFunc = (grade: Grade, type: ClassType) => number;

export class GpaFormula {
    public static readonly allFormulas: GpaFormula[] = [];
    static getById(id: number): GpaFormula {
        return this.allFormulas.find(formula => formula.id === id)!;
    }

    private static nextId: number = 0;
    public readonly id: number;
    private constructor(
        public readonly name: string,
        public readonly ignoredClasses: ClassType[],
        private readonly func: GpaFormulaFunc
    ) {
        this.id = GpaFormula.nextId++;
        GpaFormula.allFormulas.push(this);
    }

    processesType(type: ClassType) {
        return !this.ignoredClasses.includes(type);
    }

    calc(grade: Grade, classType: ClassType) {
        if (!this.processesType(classType)) {
            console.warn(
                "Tried to get the grade of a ",
                classType,
                " class using the ",
                this.name,
                " gpa forumla. This formula ignores these kind of classes, and this may result in an inccorect GPA calculation"
            );
            return 0;
        }

        return this.func(grade, classType);
    }

    getAverageGPA(classes: { grade: Grade; classType: ClassType }[]) {
        classes = classes.filter(c => this.processesType(c.classType));
        return (
            classes.reduce((prev, curr) => prev + this.calc(curr.grade, curr.classType), 0) / classes.length
        );
    }

    getAverageGPAFromRawData(classes: any[]) {
        classes = classes.filter(c => c.cumgrade !== null);
        if (classes.length === 0) return NaN;
        return this.getAverageGPA(
            classes.map(c => ({
                classType: ClassType.fromName(c.sectionidentifier),
                grade: new Grade(c.cumgrade),
            }))
        );
    }

    public static readonly CC = new GpaFormula(
        "CC Weighting",
        [ClassType.UNMARKED],
        (grade, type) => GpaFormula.UNWEIGHTED.func(grade, type) + (type.extraHonorsPoint ? 1 : 0)
    );

    public static readonly UNWEIGHTED = new GpaFormula(
        "Unweighted - 4.33",
        [ClassType.UNMARKED],
        (grade, type) => Grade.lettersToGPA[grade.letter] + Grade.modifiersToGPA[grade.modifier]
    );

    public static readonly UNWEIGHTED_NO_A_PLUS = new GpaFormula(
        "Unweighted - 4.0",
        [ClassType.UNMARKED],
        (grade, type) => Math.min(4, GpaFormula.UNWEIGHTED.func(grade, type))
    );

    public static readonly STRAIGHT = new GpaFormula(
        "Straight Letter",
        [ClassType.UNMARKED],
        (grade, type) => Grade.lettersToGPA[grade.letter]
    );

    // No theology
    public static readonly UNWEIGHTED_NO_THEOLOGY = new GpaFormula(
        "Unweighted - 4.33 (No Theology)",
        [ClassType.UNMARKED, ClassType.THEOLOGY],
        GpaFormula.UNWEIGHTED.func
    );
    public static readonly STRAIGHT_NO_A_PLUS_NO_THEOLOGY = new GpaFormula(
        "Unweighted - 4.0 (No Theology)",
        [ClassType.UNMARKED, ClassType.THEOLOGY],
        GpaFormula.UNWEIGHTED_NO_A_PLUS.func
    );
    public static readonly STRAIGHT_NO_THEOLOGY = new GpaFormula(
        "Straight Letter (No Theology)",
        [ClassType.UNMARKED, ClassType.THEOLOGY],
        GpaFormula.STRAIGHT.func
    );
}
