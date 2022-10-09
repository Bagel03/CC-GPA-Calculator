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
}
