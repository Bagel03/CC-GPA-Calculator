import { Class } from "./class.js";

// This function just loads all the classes on the page, it doesn't care about the current quarter
export const parseClasses = () => {
    const rows = Array.from(
        document
            .getElementsByClassName("bb-tile-content-section")[3]
            .getElementsByClassName("row") as HTMLCollectionOf<HTMLDivElement>
    );

    rows.shift();

    // A trick I learned a while ago, flatmap allows you to remove elements while mapping

    return rows
        .flatMap((el) => {
            const course = el
                .getElementsByClassName("col-md-3")[0]
                .getElementsByTagName("h3")[0]
                .innerHTML.toString();
            let currentGradeStr = el
                .getElementsByClassName("showGrade")[0] //Grade element
                .innerHTML.toString() // Text
                .replace(/^\s+|\s+$/gm, "") // Remove spaces
                .replace(/%/g, ""); // remove %

            let currentGrade = parseFloat(currentGradeStr);
            if (Number.isNaN(currentGrade)) {
                return []; // This will scoot this class out of the list
            }

            return [new Class(course, currentGrade, el)];
        })
        .flat()
        .sort((a, b) => a.period - b.period);
};
