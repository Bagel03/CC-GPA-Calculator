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

// + or -
class Modifier {
    private constructor(
        public readonly string: string,
        public readonly cutoff: number,
        public readonly GPA: number
    ) {}

    public static readonly PLUS = new Modifier("+", 6.5, 0.33);
    public static readonly MINUS = new Modifier("-", -0.5, -0.33);
    public static readonly NONE = new Modifier("", 2.5, 0);

    public static readonly modifiers = [this.PLUS, this.NONE, this.MINUS];
}

enum GradeLetter {
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    F = "F",
}
// A/B/C/D/F
class Letter {
    private constructor(
        public readonly string: GradeLetter,
        public readonly minValue: number,
        public readonly GPA: number
    ) {}

    static readonly A = new Letter(GradeLetter.A, 90, 4);
    static readonly B = new Letter(GradeLetter.B, 80, 3);
    static readonly C = new Letter(GradeLetter.C, 70, 2);
    static readonly D = new Letter(GradeLetter.D, 60, 1);
    static readonly F = new Letter(GradeLetter.F, 0, 0);

    static readonly letters = [this.A, this.B, this.C, this.D, this.F];
}

// A+, B-, etc.
export class LetterGrade {
    private constructor(
        public readonly letter: Letter,
        public readonly modifier: Modifier
    ) {}

    rawGPA() {
        return this.letter.GPA + this.modifier.GPA;
    }

    minGrade() {
        return this.letter.minValue + this.modifier.cutoff;
    }

    toString() {
        return this.letter.string + this.modifier.string;
    }

    public static readonly grades = [
        new LetterGrade(Letter.A, Modifier.PLUS),
        new LetterGrade(Letter.A, Modifier.NONE),
        new LetterGrade(Letter.A, Modifier.MINUS),
        new LetterGrade(Letter.B, Modifier.PLUS),
        new LetterGrade(Letter.B, Modifier.NONE),
        new LetterGrade(Letter.B, Modifier.MINUS),
        new LetterGrade(Letter.C, Modifier.PLUS),
        new LetterGrade(Letter.C, Modifier.NONE),
        new LetterGrade(Letter.C, Modifier.MINUS),
        new LetterGrade(Letter.D, Modifier.PLUS),
        new LetterGrade(Letter.D, Modifier.NONE),
        new LetterGrade(Letter.D, Modifier.MINUS),
        new LetterGrade(Letter.F, Modifier.NONE),
    ];

    public static for(percent: number) {
        let g = this.grades.find((grade) => grade.minGrade() <= percent);
        if (!g) return this.grades[this.grades.length - 1]; // F
        return g;
    }

    static parse(string: string) {
        string = string.toUpperCase().trim().replaceAll(" ", "");
        if (string.length > 2 || string.length == 0) return undefined;

        return this.grades.find((g) => g.toString() == string);
    }
}

// 100 (A+), 81.5 (B-), etc.
export class Grade {
    public readonly letter: LetterGrade;

    constructor(public readonly percent: number) {
        this.letter = LetterGrade.for(percent);
    }

    clone() {
        return new Grade(this.percent);
    }

    setPercent(percent: number) {
        //@ts-ignore
        this.percent = percent;

        //@ts-ignore
        this.letter = LetterGrade.for(percent);
    }

    setToMinPercentForLetter(grade: LetterGrade) {
        this.setPercent(grade.minGrade());
    }

    setToMinPercentForRawGpa(gpa: number) {
        const letter = LetterGrade.grades.find(
            (grade) => grade.rawGPA() == gpa
        );
        if (!letter) throw new Error("Invalid GPA");

        this.setToMinPercentForLetter(letter!);
    }

    toString(includePercent = false) {
        if (includePercent) {
            return `${this.percent.toFixed(2)}% (${this.letter.toString()})`;
        }
        return this.letter.toString();
    }

    rawGPA = () => this.letter.rawGPA();
}
