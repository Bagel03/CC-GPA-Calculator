import { GpaProp } from "./class/props/gpa.js";
import { LetterProp } from "./class/props/letter.js";
import { PercentProp } from "./class/props/percent.js";
import { EditableClassProp } from "./class/prop.js";
import { ClassType } from "./class/props/type.js";
import { GradeTime } from "./class/props/time.js";
import { RawGpaProp } from "./class/props/raw_gpa.js";
import { GradeProp } from "./class/props/grade.js";

// These are class props that need the time at which they modify (grade-secondQuarter, gpa-exam, ...)
type timedClassProps = {
    grade: GradeProp;
    gradePercent: PercentProp;
    gradeLetter: LetterProp;
    gpa: GpaProp;
    rawGpa: RawGpaProp;
};
const timedClassPropsToConstructors = {
    grade: GradeProp,
    gradePercent: PercentProp,
    gradeLetter: LetterProp,
    gpa: GpaProp,
    rawGpa: RawGpaProp,
};

// These are class props that are always present
type guaranteedClassProps = {
    type: ClassType;
    period: number;
    name: string;
};

// Props that can be changed
export type ClassProps = {
    [type in keyof timedClassProps as `${type}-${GradeTime}`]: timedClassProps[type];
} & guaranteedClassProps;

export type PartialClassProps = {
    [type in keyof timedClassProps as `${type}-${GradeTime}`]+?: timedClassProps[type];
} & guaranteedClassProps;

export type VisibleClassProps = {
    [key in keyof ClassProps as ClassProps[key] extends EditableClassProp<any>
        ? key
        : never]: ClassProps[key];
};

export class Class {
    private static nextID = 0;
    private static classes: Record<number | string, Class> = {};
    public readonly id: number;
    private props: ClassProps;

    constructor(props: PartialClassProps) {
        this.props = props as ClassProps;
        this.id = Class.nextID++;
        Class.classes[this.id] = this;

        // Add to the props
        for (const [key, prop] of Object.entries(props)) {
            if (prop instanceof EditableClassProp) prop.connectTo(this);
        }

        for (const [key, constructor] of Object.entries(
            timedClassPropsToConstructors
        )) {
            for (const time of [
                GradeTime.FIRST_QUARTER,
                GradeTime.SECOND_QUARTER,
                GradeTime.EXAM,
                GradeTime.OVERALL,
            ]) {
                const fullKey = `${key}-${time}` as keyof ClassProps;
                if (!this.hasProp(fullKey)) {
                    this.addProp(fullKey, new constructor({ time }));
                }
            }
        }
    }

    clone() {
        let c = new Class({
            type: this.props.type,
            name: this.props.name,
            period: this.props.period,
        });
        //@ts-ignore
        c.id = this.id;

        for (const [key, value] of Object.entries(this.props)) {
            if (typeof (value as any).clone === "function") {
                c.addProp(key as keyof ClassProps, (value as any).clone());
            }
        }

        return c;
    }

    addProp<P extends keyof ClassProps>(key: P, prop: ClassProps[P]) {
        this.props[key] = prop;
        if (prop instanceof EditableClassProp || prop instanceof GradeProp) {
            prop.connectTo(this);
        } else {
        }
    }

    getProp<P extends keyof ClassProps>(prop: P): ClassProps[P] {
        return this.props[prop];
    }

    getPropAsStr<P extends keyof VisibleClassProps>(
        prop: P
    ): string | undefined {
        return this.getProp(prop)?.getString();
    }

    hasProp(prop: keyof ClassProps) {
        return !!this.props[prop];
    }

    static average<P extends keyof ClassProps>(
        classes: Class[],
        propKey: P,
        adderFn: (current: ClassProps[P]) => number = (prop) =>
            (prop as EditableClassProp<any, any>).getValue(),
        ignore: (c: Class) => boolean = (c) =>
            c.getProp("type") == ClassType.UNCOUNTED
    ) {
        let total = 0;
        let sum = 0;
        for (const c of classes) {
            if (ignore(c)) continue;
            const prop = c.getProp(propKey);
            if (
                typeof (prop as any).isPresent !== "undefined" &&
                !(prop as any).isPresent()
            )
                continue;
            sum += adderFn(prop as ClassProps[P]);
            total++;
        }

        return sum / total;
    }

    static getTotalGPA(
        classes: Class[],
        time: GradeTime,
        isUnweighted = false
    ) {
        // The sum          The total number of counted classes
        let sum: number = 0,
            total: number = 0;
        for (let i = 0; i < classes.length; i++) {
            if (classes[i].getProp("type") == ClassType.UNCOUNTED) continue;

            let prop: keyof ClassProps = `${
                isUnweighted ? "rawGpa" : "gpa"
            }-${time}`;

            const val = classes[i].getProp(prop);
            if (!val) continue;
            sum += val.getValue();
            total++;
        }
        return sum / total;
    }

    static getClassById(id: number | string) {
        return this.classes[id];
    }

    static getClassFromEle(ele: HTMLElement) {
        const id = ele.getAttribute("classID");
        if (!id) return;
        return this.getClassById(id);
    }
}
