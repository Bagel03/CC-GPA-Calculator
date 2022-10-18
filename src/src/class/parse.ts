import { Class, ClassProps, PartialClassProps } from "../class.js";
import { fullMap } from "../utils.js";
import { GpaProp } from "./props/gpa.js";
import { GradeProp } from "./props/grade.js";
import { LetterProp } from "./props/letter.js";
import { PercentProp } from "./props/percent.js";
import { GradeTime } from "./props/time.js";
import { ClassType } from "./props/type.js";

export const getGradeFromEl = (el: HTMLDivElement) => {
    return el
        .getElementsByClassName("showGrade")[0] //Grade element
        .innerHTML.toString() // Text
        .replace(/^\s+|\s+$/gm, "") // Remove spaces
        .replace(/%/g, ""); // remove %
};

export const getNameAndPeriodFromEl = (el: HTMLDivElement) => {
    let [name, periodStr] = el
        .getElementsByClassName("col-md-3")[0]
        .getElementsByTagName("h3")[0]
        .innerHTML.toString()
        .split("(Period");
    periodStr = periodStr.trim()[0];
    name = name.slice(0, name.indexOf("-")).trim();
    return [name, periodStr];
};

export const getClassPropsFromEl = (
    time: GradeTime,
    el: HTMLDivElement
): undefined | PartialClassProps => {
    // The grade (in a string)
    const gradeStr = getGradeFromEl(el);

    const gradePercent = parseFloat(gradeStr);
    if (Number.isNaN(gradePercent)) {
        return;
    }

    // Get the name and the period from the title thing
    let [name, periodStr] = getNameAndPeriodFromEl(el);
    const type = ClassType.getTypeFor(name);
    const period = parseFloat(periodStr);

    return {
        name,
        period,
        type,
        [`grade-${time}`]: new GradeProp({ time }, gradePercent),
        [`gradeLetter-${time}`]: new LetterProp({ time }),
        [`gradePercent-${time}`]: new PercentProp({ time }),
        [`gpa-${time}`]: new GpaProp({ time }),
    };
};

export const getRows = () => {
    return Array.from(
        document
            .getElementsByClassName("bb-tile-content-section")[3]
            .getElementsByClassName("row") as HTMLCollectionOf<HTMLDivElement>
    ).slice(1);
};

export const getClassPropsFromPage = (time: GradeTime) => {
    const rows = getRows();
    return fullMap(rows, (el) => getClassPropsFromEl(time, el));
};

export const constructClassesFromPage = (time: GradeTime) => {
    return getClassPropsFromPage(time).map((props) => {
        let c = new Class(props);
        return c;
    });
};

export const updateClassesFromPage = (classes: Class[], time: GradeTime) => {
    const newClassesProps = getClassPropsFromPage(time);
    for (const newClassProps of newClassesProps) {
        const matchingOldClass = classes.find(
            (c) =>
                c.getProp("name") === newClassProps.name &&
                c.getProp("period") === newClassProps.period &&
                c.getProp("type") === newClassProps.type
        );

        if (matchingOldClass) {
            for (const [key, value] of Object.entries(newClassProps)) {
                matchingOldClass.addProp(key as keyof ClassProps, value);
            }
        } else {
            classes.push(new Class(newClassProps));
        }
    }
    return classes;
};
