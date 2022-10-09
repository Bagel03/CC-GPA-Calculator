export {};
enum GradeLetter {
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    F = "F",
}

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

export enum Modifier {
    PLUS = "+",
    MINUS = "-",
    NONE = "",
}

export class Grade {
    public readonly letter: Letter;
    public readonly modifier: Modifier;

    constructor(public readonly percent: number) {
        const { letter, modifier } = Grade.parsePercent(percent);
        this.letter = letter;
        this.modifier = modifier;
    }

    static parsePercent(percent: number) {
        percent = Math.round(percent);

        for (const letter of Letter.letters) {
            if (percent < letter.minValue) continue;

            // This is the right letter
            let modifier = Modifier.NONE;
            if (letter == Letter.F) return { letter, modifier };

            const diff = percent - letter.minValue;
            if (diff > 6) modifier = Modifier.PLUS;
            if (diff < 3) modifier = Modifier.MINUS;

            return { letter, modifier };
        }
        return { letter: Letter.F, modifier: Modifier.NONE };
    }

    toString() {
        return this.letter.string + this.modifier;
    }

    rawGPA() {
        switch (this.modifier) {
            case Modifier.NONE:
                return this.letter.GPA;
            case Modifier.PLUS:
                return this.letter.GPA + 0.33;
            case Modifier.MINUS:
                return this.letter.GPA - 0.33;
        }
    }
}
