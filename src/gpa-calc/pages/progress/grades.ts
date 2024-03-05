import { fetchClasses } from "../../api/classes.js";
import { Grade } from "../../grades/grade.js";
import { createEl } from "../../utils/elements.js";

// Renders the (A+) next to your grades
export async function renderGrades(classes: any[]) {
    let grades: HTMLHeadingElement[] = [];
    while (grades.length === 0) {
        grades = Array.from(
            document.getElementsByClassName("showGrade") as HTMLCollectionOf<HTMLHeadingElement>
        );

        await new Promise(res => setTimeout(res, 100));
    }

    grades.forEach(grade => {
        grade.style.visibility = "hidden";
        grade.querySelectorAll("span").forEach(span => span.remove());
    });
    // const grades = document.getElementsByClassName("showGrade") as HTMLCollectionOf<HTMLHeadingElement>;
    // if (grades.length === 0) throw new Error("No grades found");

    for (let i = 0; i < grades.length; i++) {
        grades[i].style.visibility = "visible";
        if (grades[i].innerHTML.trim() == "--&nbsp;&nbsp;") continue;

        const grade = new Grade(classes[i].cumgrade);
        grades[i].append(createEl("span", [], `(${grade.toString()})`));
    }
}
