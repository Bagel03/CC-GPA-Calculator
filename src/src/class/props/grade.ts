import { COMPRESSION_LEVEL } from "../../../../node_modules/zip-a-folder/dist/lib/ZipAFolder.js";
import { Class } from "../../class.js";
import { Grade } from "../../grade.js";
import { GradeTime } from "./time.js";

export class GradeProp extends Grade {
    public static readonly OVERALL_WEIGHTS = [0.4, 0.4, 0.2];

    public readonly owner!: Class;
    private directIsValid: boolean;

    constructor(
        public readonly options: { time: GradeTime },
        percent?: number
    ) {
        const p =
            options.time !== GradeTime.OVERALL && percent !== undefined
                ? percent
                : 0;

        super(p);

        if (percent !== undefined) {
            this.directIsValid = true;
        } else {
            this.directIsValid = false;
        }
    }

    markInvalid() {
        this.directIsValid = false;
    }

    recalculate() {
        if (this.options.time !== GradeTime.OVERALL) return;

        const grades = [
            GradeTime.FIRST_QUARTER,
            GradeTime.SECOND_QUARTER,
            GradeTime.EXAM,
        ].map((num) => this.owner.getProp(`grade-${num}`));
        if (grades.some((grade) => !grade.isValid())) return;

        const percents = grades.map((grade) => grade.percent);
        console.log(percents);

        this.setPercent(
            percents.reduce(
                (prev, curr, idx) =>
                    prev + curr * GradeProp.OVERALL_WEIGHTS[idx],
                0
            ),
            true
        );
    }

    setPercent(percent: number, quickReturn = false): void {
        super.setPercent(percent);
        this.directIsValid = true;
        if (quickReturn) return;

        if (this.options.time !== GradeTime.OVERALL) {
            this.owner.getProp(`grade-3`).recalculate();
        } else {
            // Calculate the exam grade
            const q1 = this.owner.getProp("grade-0");
            const q2 = this.owner.getProp("grade-1");
            const exam = this.owner.getProp("grade-2");

            // TODO: more edge cases
            // If there is no q2 grade, just set it to the same as q1
            if (!q2.isValid() && q1.isValid()) {
                q2.setPercent(q1.percent);
            } else if (!q1.isValid() && q2.isValid()) {
                q1.setPercent(q2.percent);
            } else if (!q1.isValid() && !q2.isValid()) {
                q1.setPercent(100);
                q2.setPercent(100);
            }

            const totalQuarter =
                GradeProp.OVERALL_WEIGHTS[0] * q1.percent +
                GradeProp.OVERALL_WEIGHTS[1] * q2.percent;
            const value =
                (percent - totalQuarter) / GradeProp.OVERALL_WEIGHTS[2];
            exam.setPercent(value, true);
        }
    }

    isValid(): boolean {
        if (this.directIsValid) return true;
        if (this.options.time == GradeTime.OVERALL) {
            return [
                GradeTime.FIRST_QUARTER,
                GradeTime.SECOND_QUARTER,
                GradeTime.EXAM,
            ].every((num) => this.owner.getProp(`grade-${num}`).isValid());
        }
        return false;
    }

    connectTo(c: Class) {
        //@ts-ignore
        this.owner = c;
    }

    clone(): GradeProp {
        let p = new GradeProp(
            { time: this.options.time },
            this.directIsValid ? this.percent : undefined
        );
        return p;
    }
}
