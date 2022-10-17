import { EditableClassProp } from "../prop.js";

export enum GradeTime {
    FIRST_QUARTER,
    SECOND_QUARTER,
    EXAM,
    OVERALL,
}

export const TImeNames = {
    [GradeTime.FIRST_QUARTER]: "1st Quarter",
    [GradeTime.SECOND_QUARTER]: "2nd Quarter",
    [GradeTime.EXAM]: "Exam",
    [GradeTime.OVERALL]: "Cumulative",
};

// A prop that depends on the time (mostly just grades/gpa)
export abstract class TimedProp<T> extends EditableClassProp<
    T,
    { time: GradeTime }
> {
    get ownerGrade() {
        return this.owner.getProp(`grade-${this.options.time}`)!;
    }

    isPresent(): boolean {
        return this.ownerGrade.isValid();
    }

    markInvalid() {
        this.ownerGrade.markInvalid();
    }
}
