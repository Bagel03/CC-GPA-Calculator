import { Grade, LetterGrade } from "../../grade.js";
import { EditableClassProp } from "../prop.js";
import { GradeTime, TimedProp } from "./time.js";

export class LetterProp extends TimedProp<LetterGrade> {
    getValue(): LetterGrade {
        return this.ownerGrade.letter;
    }

    parseFromString(str: string): LetterGrade | false {
        return LetterGrade.parse(str) ?? false;
    }

    update(val: LetterGrade): void {
        this.ownerGrade.setToMinPercentForLetter(val);
    }
}
