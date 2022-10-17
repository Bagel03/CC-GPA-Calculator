import { Grade } from "../../grade.js";
import { EditableClassProp } from "../prop.js";
import { ClassProps } from "../../class.js";
import { GradeTime, TimedProp } from "./time.js";

export class PercentProp extends TimedProp<number> {
    getValue(): number {
        return this.ownerGrade.percent;
    }

    parseFromString(str: string): number | false {
        let num = parseFloat(str);
        if (Number.isNaN(num)) return false;
        return num;
    }

    update(val: number): void {
        this.ownerGrade.setPercent(val);
    }
}
