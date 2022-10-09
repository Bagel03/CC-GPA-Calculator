import { parseClasses } from "./parser.js";
import { render } from "./renderer.js";
/*
Letter Numerical Academic Honors / Advanced
Grade Grade Courses Courses
A+ 100 - 97 4.33 5.33
A 96 - 93 4.00 5.00
A- 92 - 90 3.67 4.67
B+ 89 - 87 3.33 4.33
B 86 - 83 3.00 4.00
B- 82 - 80 2.67 3.67
C+ 79 - 77 2.33 3.33
C 76 - 73 2.00 3.00
C- 72 - 70 1.67 2.67
D+ 69 - 67 1.33 2.33
D 66 - 63 1.00 2.00
D- 62 - 60 0.67 1.67
F Below 60 0.00 0.00
*/

// const styleEl = document.createElement("style");
// styleEl.innerHTML = `
// .gpaCenter {
//     margin: 1em, 0.5em;
//     padding: 1em, 0.5em;
//     text-align: center;
// }
// `;
// styleEl.id = CC_GPA_INJECTOR + "-styles";
// document.head.appendChild(styleEl);

// const renderModal = (grades: ClassGrade[]) => {
//     const dialog = createEl("dialog");
//     const container = createEl("div");
//     container.style.width = "100%";
//     dialog.append(container);
//     dialog.id = CC_GPA_INJECTOR + "Modal";
//     const gpaEl = createEl(
//         "div",
//         "",
//         `Your CC GPA: ${ClassGrade.getTotalGPA(grades).toFixed(3)}`
//     );

//     const table = createEl("table");
//     table.style.width = "auto";
//     container.append(gpaEl, table);

//     const colNames = createEl("tr");
//     colNames.append(
//         createEl("td", "", "Class Name"),
//         createEl("td", "gpaCenter", "Class Type"),
//         createEl("td", "gpaCenter", "Percentage"),
//         createEl("td", "gpaCenter", "Letter Grade"),
//         createEl("td", "gpaCenter", "GPA Weighting")
//     );
//     table.append(colNames);

//     for (const grade of grades) {
//         const row = createEl("tr");
//         row.append(
//             createEl("td", "", grade.className),
//             createEl("td", "gpaCenter", grade.type.type),
//             createEl("td", "gpaCenter", grade.percent.toString()),
//             createEl("td", "gpaCenter", grade.toString()),
//             createEl("td", "gpaCenter", grade.gpaWeight().toFixed(2))
//         );
//         table.append(row);
//     }

//     document.body.appendChild(dialog);
// };

// const renderGPA = (grades: ClassGrade[]) => {
//     document
//         .getElementById("performanceCollapse")!
//         .getElementsByTagName("div")[0].id = "gpaParent";
//     const link = createEl("a", "accordion-toggle");
//     link.innerHTML = " CC GPA";
//     link.id = "gpaDisplay";
//     link.href = `javascript:document.getElementById('${
//         CC_GPA_INJECTOR + "Modal"
//     }').showModal()`;

//     let x = createEl(
//         "span",
//         ["label", "label-success"],
//         ClassGrade.getTotalGPA(grades).toFixed(3)
//     );
//     x.style.backgroundColor = "#004F9E";

//     let br = createEl("br");
//     let hr = createEl("hr");
//     let y = document.getElementById("gpaParent")!;
//     y.appendChild(x);
//     y.appendChild(link);
//     y.appendChild(br);
//     y.appendChild(hr);
// };

// const renderGrades = (grades: ClassGrade[]) => {
//     const gradeEls = Array.from(document.getElementsByClassName("showGrade"));

//     let currentGradeToInsert = 0;
//     let currentGradeEl = 0;
//     while (currentGradeToInsert < grades.length) {
//         if (
//             !Number.isNaN(
//                 parseFloat(
//                     gradeEls[currentGradeEl].innerHTML
//                         .toString()
//                         .replace(/^\s+|\s+$/gm, "")
//                         .replace(/%/g, "")
//                 )
//             )
//         ) {
//             gradeEls[
//                 currentGradeEl
//             ].innerHTML += `<span class="${CC_GPA_INJECTOR}"> (${grades[
//                 currentGradeToInsert
//             ].toString()})</span>`;
//             currentGradeToInsert++;
//         }
//         currentGradeEl++;
//     }
// };

let needReRender = true;
const observer = new MutationObserver(() => {
    if (document.getElementsByClassName("progress").length > 0) {
        needReRender = true;
        return;
    }
    if (needReRender) render(parseClasses());
    needReRender = false;
});

observer.observe(document.body, { childList: true });
