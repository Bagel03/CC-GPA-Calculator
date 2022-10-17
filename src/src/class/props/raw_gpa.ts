import { Grade } from "../../grade.js";
import { clamp, roundNumberToDivisions } from "../../utils.js";
import { TimedProp } from "./time.js";

export class RawGpaProp extends TimedProp<number> {
    getValue(): number {
        return this.ownerGrade.rawGPA();
    }

    parseFromString(str: string): number | false {
        str = str.replaceAll("%", "").replaceAll(" ", "").trim();
        const num = parseFloat(str);

        if (Number.isNaN(num)) {
            return false;
        }

        return num
            .pipe(roundNumberToDivisions, 3)
            .pipe(clamp, 0, new Grade(100).rawGPA());
    }

    update(val: number): void {
        this.ownerGrade.setToMinPercentForRawGpa(val);
    }
}
