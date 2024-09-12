import { ClassInfo, fetchClasses } from "../../api/classes.js";
import { Grade } from "../../grades/grade.js";
import { createEl } from "../../utils/elements.js";

// Renders the (A+) next to your grades
export async function renderGrades(classes: ClassInfo[]) {

    const grades = document.getElementsByClassName("showGrade") as HTMLCollectionOf<HTMLHeadingElement>;

    if(grades.length != classes.length) throw new Error("No grades found");
    console.log(grades, classes)
    for (let i = 0; i < grades.length; i++) {
        grades[i].style.visibility = "visible";
        if (grades[i].innerHTML.trim() == "--&nbsp;&nbsp;") continue;

        const grade = new Grade(parseFloat(classes[i].cumgrade));
        grades[i].append(createEl("span", [], `(${grade.toString()})`));
    }
}