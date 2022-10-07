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

enum Letter {
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    F = "F",
}

enum ClassType {
    HONORS = "Honors",
    AP = "AP",
    REGULAR = "Regular",
    GYM = "Gym",
}

const classTypeChecks: Record<string, ClassType> = {
    honors: ClassType.HONORS,
    ap: ClassType.AP,
    physical: ClassType.GYM,
};

enum Modifiers {
    PLUS = "+",
    MINUS = "-",
}

type modifier = Modifiers | "";

class ClassGrade {
    private static readonly thresholds: Record<Letter, number> = {
        [Letter.A]: 90,
        [Letter.B]: 80,
        [Letter.C]: 70,
        [Letter.D]: 60,
        [Letter.F]: 0,
    };

    private static readonly weights: Record<Letter, number> = {
        [Letter.A]: 4,
        [Letter.B]: 3,
        [Letter.C]: 2,
        [Letter.D]: 1,
        [Letter.F]: 0,
    };

    public readonly value: Letter;
    public readonly modifier: modifier;

    constructor(
        public readonly className: string,
        public readonly percent: number,
        public readonly type: ClassType = ClassType.REGULAR
    ) {
        const { value, modifier } = ClassGrade.fromPercent(percent);
        this.value = value;
        this.modifier = modifier;
    }

    /**
     *
     * @returns {number} The gpa value of this course's current grade (3.7, 4.3, etc.)
     */
    gpaWeight(): number {
        if (this.value === Letter.F) return 0;

        let value = ClassGrade.weights[this.value];
        if (this.modifier == "+") value += 0.33;
        else if (this.modifier == "-") value -= 0.33;
        if (this.type == ClassType.HONORS || this.type == ClassType.AP)
            value += 1;
        return value;
    }

    static fromPercent(percent: number) {
        percent = Math.round(percent);

        let currentLetter: Letter = Letter.F,
            currentThreshold = 0;

        for (let [letter, threshold] of Object.entries(this.thresholds)) {
            if (percent >= threshold && threshold >= currentThreshold) {
                currentLetter = letter as unknown as Letter;
                currentThreshold = threshold;
            }
        }
        // How off it is from the bottom grade.
        // anything 7 or up gets +, anything 2 or below gets -
        const diff = percent - currentThreshold;
        const sign: modifier =
            diff > 6 ? Modifiers.PLUS : diff < 3 ? Modifiers.MINUS : "";
        return { modifier: sign, value: currentLetter };
    }

    /**
     *
     * @returns {string} The letter grade for this class (A+, B, C-, etc.)
     */
    toString() {
        let str: string = this.value;
        if (this.modifier) str += this.modifier;
        if (this.type == ClassType.GYM) str += "*";
        return str;
    }

    static getTotalGPA(grades: ClassGrade[]) {
        let totalGrades = grades.length;
        let sum = grades.reduce((sum, currentGrade) => {
            if (currentGrade.type === ClassType.GYM) {
                totalGrades--;
                return sum;
            }
            return sum + currentGrade.gpaWeight();
        }, 0);
        return sum / totalGrades;
    }
}

const getGradesAndClasses = () => {
    const classEles = document.getElementsByClassName(
        "bb-tile-content-section"
    );
    const rows = classEles.item(3)!.getElementsByClassName("row");
    const rowsArr: Array<Element> = Array.from(rows);
    rowsArr.shift();
    const gradeStrs = rowsArr.map((el) => {
        const course = el
            .getElementsByClassName("col-md-3")[0]
            .getElementsByTagName("h3")[0]
            .innerHTML.toString();
        let currentGrade = el
            .getElementsByClassName("showGrade")[0]
            .innerHTML.toString();
        // Removing spaces and the "%":
        currentGrade = currentGrade
            .replace(/^\s+|\s+$/gm, "")
            .replace(/%/g, "");
        return [currentGrade, course];
    });

    // Use flatmap to remove any bad grades.
    const gradeNums: [number, string][] = gradeStrs.flatMap(([str, c]) => {
        const num = parseFloat(str);
        if (Number.isNaN(num)) {
            return [];
        }
        return [[num, c]];
    });

    const grades = gradeNums.map(([gradeNum, c]) => {
        let classType = ClassType.REGULAR;
        for (const [key, type] of Object.entries(classTypeChecks)) {
            if (c.toLowerCase().includes(key)) {
                classType = type;
                break;
            }
        }

        return new ClassGrade(c, gradeNum, classType);
    });
    return grades;
};

const CC_GPA_INJECTOR = "CC_GPA_INJECTOR";

// Used for cleanup, all elements we create must be tagged with CC_GPA_INJECTOR
const createEl = <T extends keyof HTMLElementTagNameMap>(
    elName: T,
    ...classNames: string[]
): HTMLElementTagNameMap[T] => {
    const el = document.createElement(elName);
    el.classList.add(CC_GPA_INJECTOR, ...classNames);
    return el;
};

const renderGPA = (grades: ClassGrade[]) => {
    document
        .getElementById("performanceCollapse")!
        .getElementsByTagName("div")[0].id = "gpaParent";
    const link = createEl("a", "accordion-toggle");
    link.innerHTML = " CC GPA";
    link.id = "gpaDisplay";
    link.href = "javascript:openInsights()";

    let x = createEl("span", "label", "label-success");
    x.style.backgroundColor = "#b7da9b";

    x.innerHTML = ClassGrade.getTotalGPA(grades).toFixed(3);

    let br = createEl("br");
    let hr = createEl("hr");
    let y = document.getElementById("gpaParent")!;
    y.appendChild(x);
    y.appendChild(link);
    y.appendChild(br);
    y.appendChild(hr);
};

const renderGrades = (grades: ClassGrade[]) => {
    const gradeEls = Array.from(document.getElementsByClassName("showGrade"));

    let currentGradeToInsert = 0;
    let currentGradeEl = 0;
    while (currentGradeToInsert < grades.length) {
        if (
            !Number.isNaN(
                parseFloat(
                    gradeEls[currentGradeEl].innerHTML
                        .toString()
                        .replace(/^\s+|\s+$/gm, "")
                        .replace(/%/g, "")
                )
            )
        ) {
            gradeEls[
                currentGradeEl
            ].innerHTML += `<span class="${CC_GPA_INJECTOR}"> (${grades[
                currentGradeToInsert
            ].toString()})</span>`;
            currentGradeToInsert++;
        }
        currentGradeEl++;
    }
};

const cleanup = () => {
    const els = document.getElementsByClassName(CC_GPA_INJECTOR);
    // Loop backwards
    for (let i = els.length - 1; i > -1; i--) {
        els[i].parentElement?.removeChild(els[i]);
    }
};

const render = (grades: ClassGrade[]) => {
    cleanup();
    renderGPA(grades);
    renderGrades(grades);
};

// MAIN
const cb = () => {
    render(getGradesAndClasses());

    const selector = document.getElementById("gradeSelect") as HTMLInputElement;
    selector.addEventListener("change", () => {
        render(getGradesAndClasses());
    });
};

window.setTimeout(() => {
    if (!window.location.href.includes("progress")) return;

    const observer = new MutationObserver(() => {
        if (document.getElementsByClassName("progress").length > 0) return;
        cb();
    });

    observer.observe(document.body, { childList: true });
}, 10);
