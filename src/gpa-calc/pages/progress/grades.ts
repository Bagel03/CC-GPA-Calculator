import { fetchClasses } from "../../api/classes.js";
import { Grade } from "../../grades/grade.js";
import { createEl } from "../../utils/elements.js";

// Renders the (A+) next to your grades
export async function renderGrades(classes: any[]) {

    const grades = document.getElementsByClassName("showGrade") as HTMLCollectionOf<HTMLHeadingElement>;

    for (let i = 0; i < grades.length; i++) {
        grades[i].style.visibility = "visible";
        if (grades[i].innerHTML.trim() == "--&nbsp;&nbsp;") continue;

        const grade = new Grade(classes[i].cumgrade);
        grades[i].append(createEl("span", [], `(${grade.toString()})`));
    }
}