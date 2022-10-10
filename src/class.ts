import { Grade } from "./grade.js";

enum classType {
    REGULAR = "Regular",
    UNCOUNTED = "Gym",
    HONORS = "Honors",
    AP = "AP",
}

const classTypeGPAModifiers: Record<classType, (num: number) => number> = {
    [classType.REGULAR]: (num) => num,
    [classType.AP]: (num) => num + 1,
    [classType.HONORS]: (num) => num + 1,
    [classType.UNCOUNTED]: (num) => 0,
};

const reverseClassTypeGPAModifiers: Record<classType, (num: number) => number> =
    {
        [classType.REGULAR]: (num) => num,
        [classType.AP]: (num) => num - 1,
        [classType.HONORS]: (num) => num - 1,
        [classType.UNCOUNTED]: (num) => 0,
    };

export type ClassProperties = {
    percent: number;
    letterGrade: string;
    gpa: number;
    unweightedGpa: number;
};
export class Class {
    public readonly name: string;
    public readonly type: classType;
    public readonly period: number;
    public readonly grade: Grade;

    constructor(
        fullName: string,
        percent: number,
        public readonly rowEl: HTMLDivElement // TODO: I should parse the rest of this in a static method
    ) {
        this.grade = new Grade(percent);
        const { name, period, type } = Class.parseName(fullName);
        this.name = name;
        this.period = period;
        this.type = type;
    }

    gpa() {
        return classTypeGPAModifiers[this.type](this.grade.rawGPA());
    }

    static parseName(fullName: string) {
        let [name, period] = fullName.split("(");
        name = name.trim();
        period = period
            .toLowerCase()
            .replace(")", "")
            .replace("period", "")
            .trim();

        let type = classType.REGULAR;
        if (name.toLowerCase().includes("physical")) type = classType.UNCOUNTED;
        if (name.toLowerCase().includes("honors")) type = classType.HONORS;
        if (name.toLowerCase().split(" ").includes("ap")) type = classType.AP;

        return { name, period: parseInt(period), type };
    }

    static totalGPA(classes: Class[]) {
        let uncounted = 0;
        const total = classes.reduce((sum, curr) => {
            if (curr.type == classType.UNCOUNTED) uncounted++;
            return sum + curr.gpa();
        }, 0);
        return total / (classes.length - uncounted);
    }

    static totalRawGPA(classes: Class[]) {
        let uncounted = 0;
        const total = classes.reduce((sum, curr) => {
            if (curr.type == classType.UNCOUNTED) uncounted++;
            return sum + curr.grade.rawGPA();
        }, 0);
        return total / (classes.length - uncounted);
    }

    clone() {
        return new Class(
            `${this.name} (Period ${this.period})`,
            this.grade.percent,
            this.rowEl
        );
    }

    isValid<P extends keyof ClassProperties>(
        prop: P,
        str: string
    ): ClassProperties[P] | false {
        switch (prop) {
            case "percent": {
                str = str.replace("%", "");
                let num = parseFloat(str);
                return Number.isNaN(num) ? false : (num as ClassProperties[P]);
            }
            case "letterGrade":
                return Grade.tryGetMinPercentFor(str) as ClassProperties[P];
            case "gpa": {
                if (this.type == classType.UNCOUNTED) return false;

                let num = parseFloat(str);
                if (Number.isNaN(num)) return false;
                if (
                    num >
                    classTypeGPAModifiers[this.type](new Grade(100).rawGPA())
                )
                    return false;
                return num as ClassProperties[P];
            }
            case "unweightedGpa": {
                let num = parseFloat(str);
                if (Number.isNaN(num)) return false;
                if (num > new Grade(100).rawGPA()) return false;
                return num as ClassProperties[P];
            }
        }

        return false;
    }

    set<P extends keyof ClassProperties>(prop: P, val: ClassProperties[P]) {
        switch (prop) {
            case "letterGrade":
                //@ts-ignore
                this.grade = new Grade(Grade.getMinPercentFor(val as string));
                break;
            case "percent":
                //@ts-ignore
                this.grade = new Grade(val as number);
                break;
            case "gpa":
                //@ts-ignore
                this.grade = Grade.rawGpaToMinGrade(
                    reverseClassTypeGPAModifiers[this.type](val as number)
                );
                break;
            case "unweightedGpa": {
                //@ts-ignore
                this.grade = Grade.rawGpaToMinGrade(val as number);
            }
        }
    }
}
